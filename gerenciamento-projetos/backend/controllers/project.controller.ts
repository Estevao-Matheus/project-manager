import { NextFunction, Request, RequestHandler, Response } from "express";
import Project from "../models/project.model";
import ProjetosUsuarios from "../models/projectUser.model";
import ProjectUser from "../models/projectUser.model";
import User from "../models/user.model";


export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectsPaginated = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      res.status(400).json({ message: "Página e limite devem ser maiores que 0" });
      return;
    }

    const status = req.query.status as string | undefined;
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    const userId = req.query.user_id as string | undefined;

    if (req.query.start_date) {
      startDate = new Date(req.query.start_date as string);
      if (isNaN(startDate.getTime())) {
        res.status(400).json({ message: "Data inicial inválida. Formato esperado: YYYY-MM-DD" });
        return;
      }
    }

    if (req.query.end_date) {
      endDate = new Date(req.query.end_date as string);
      if (isNaN(endDate.getTime())) {
        res.status(400).json({ message: "Data final inválida. Formato esperado: YYYY-MM-DD" });
        return;
      }
    }

    if (startDate && endDate && startDate > endDate) {
      res.status(400).json({ message: "Data inicial não pode ser maior que a data final" });
      return;
    }

    const filter: any = {};
    if (status && ["Em andamento", "Concluído", "Pendente"].includes(status)) {
      filter.status = status;
    } else if (status) {
      res.status(400).json({ message: "Status inválido. Use: 'Em andamento', 'Concluído', 'Pendente'" });
      return;
    }
    if (startDate) filter.data_inicio = { $gte: startDate };
    if (endDate) filter.data_fim = { $lte: endDate };

    // Filter by user if user_id is provided
    if (userId) {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      // Find project IDs associated with the user
      const userProjects = await ProjectUser.find({ usuario_id: userId }).exec();
      const projectIds = userProjects.map(up => up.projeto_id);

      if (projectIds.length === 0) {
        res.status(200).json({
          projects: [],
          totalProjects: 0,
          totalPages: 0,
          currentPage: page,
          filters: {
            status: req.query.status,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            user_id: req.query.user_id
          }
        });
        return;
      }

      filter._id = { $in: projectIds };
    }

    const projects = await Project.find(filter).skip(skip).limit(limit).exec();
    const totalProjects = await Project.countDocuments(filter).exec();

    res.status(200).json({
      projects,
      totalProjects,
      totalPages: Math.ceil(totalProjects / limit),
      currentPage: page,
      filters: {
        status: req.query.status,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        user_id: req.query.user_id
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Erro na consulta de paginação", error: error.message });
  }
};



export const getProject: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ message: "Projeto não encontrado" });
      return;
    }

    // Generate CSRF token and include it in the response
    const csrfToken = req.csrfToken();
    res.status(200).json({ project, csrfToken });
  } catch (error: any) {
    next(error); // Ensure the error is passed to next() for proper error handling
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!["Em andamento", "Concluído", "Pendente"].includes(status)) {
      res
        .status(400)
        .json({ message: "Status inválido. Use: 'Em andamento', 'Concluído', 'Pendente'" });
      return;
    }

    const project = await Project.create(req.body);
    res.status(200).json({ message: "Projeto criado com sucesso!API", project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status && !["Em andamento", "Concluído", "Pendente"].includes(status)) {
      res
        .status(400)
        .json({ message: "Status inválido. Use: 'Em andamento', 'Concluído', 'Pendente'" });
      return;
    }

    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });

    if (!project) {
      res.status(404).json({ message: "Projeto não encontrado" });
      return;
    }

    res.status(200).json({ message: "Projeto atualizado com sucesso! API", project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ message: "Projeto não encontrado" })
      return;
    }
    if (project.status !== "Concluído") {
      res
        .status(400)
        .json({ message: "Somente projetos 'Concluídos' podem ser deletados" });
      return;
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Projeto deletado com sucesso! API" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserToProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projetoId, userId } = req.body;

    const existingRelation = await ProjetosUsuarios.findOne({
      projeto_id: projetoId,
      usuario_id: userId,
    });
    if (existingRelation) {
      res
        .status(400)
        .json({ message: "Usuário já está associado a este projeto" });
      return;
    }

    const newRelation = new ProjetosUsuarios({
      projeto_id: projetoId,
      usuario_id: userId,
    });
    await newRelation.save();

    res.status(200).json(newRelation);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeUserFromProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projetoId, userId } = req.body;

    const relation = await ProjetosUsuarios.findOneAndDelete({
      projeto_id: projetoId,
      usuario_id: userId,
    });
    if (!relation) {
      res.status(404).json({ message: "Relação não encontrada" });
      return;
    }

    res.status(200).json({ message: "Usuário removido do projeto" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listUsersInProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projetoId } = req.params;

    const relations = await ProjetosUsuarios.find({
      projeto_id: projetoId,
    }).populate("usuario_id", "nome email papel");
    const users = relations.map((relation) => relation.usuario_id);

    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProjects = await Project.countDocuments({});

    const finalResult = [
      {
        _id: "Total de Projetos",
        count: totalProjects,
      },
      ...result,
    ];

    res.status(200).json(finalResult);
  } catch (error: any) {
    res.status(500).json({
      message: "Erro ao listar quantidade de projetos por status",
      error: error.message,
    });
  }
};


