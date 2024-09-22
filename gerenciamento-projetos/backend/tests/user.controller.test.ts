import { Request, Response } from "express";
import User from "../models/user.model";
import {
    register,
    login,
    logout,
    deleteUser,
    updateUser,
    listAllUsers,
    listAllUsersPaginated,
    getUsersByRole,
} from "../controllers/user.controller";

jest.mock("../models/user.model");

describe("Testes Unitários do User Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });
        req = {};
        res = {
            status,
            cookie: jest.fn(),
            set: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it("Deve realizar logout com sucesso", () => {
        logout(req as Request, res as Response);

        expect(res.cookie).toHaveBeenCalledWith("jwt", "", expect.any(Object));
        expect(res.set).toHaveBeenCalledWith("Access-Control-Allow-Credentials", "true");
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ message: "Logged out com sucesso" });
    });

    it("Deve deletar um usuário com sucesso", async () => {
        const mockUser = { _id: "123" };
        (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);
        req = { params: { id: "123" } };

        await deleteUser(req as Request, res as Response);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ message: "Usuario deletado com sucesso" });
    });

    it("Deve retornar erro ao tentar deletar um usuário inexistente", async () => {
        (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
        req = { params: { id: "999" } };

        await deleteUser(req as Request, res as Response);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("999");
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "Usuario não encontrado" });
    });

    it("Deve atualizar um usuário com sucesso", async () => {
        const mockUser = { _id: "123", nome: "Updated User" };
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);
        req = { params: { id: "123" }, body: { nome: "Updated User" } };

        await updateUser(req as Request, res as Response);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", { nome: "Updated User" }, { new: true });
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ message: "Usuário atualizado com sucesso! API", user: mockUser });
    });

    it("Deve listar todos os usuários com sucesso", async () => {
        const mockUsers = [{ _id: "123", nome: "User1" }, { _id: "124", nome: "User2" }];
        (User.find as jest.Mock).mockResolvedValue(mockUsers);

        await listAllUsers(req as Request, res as Response);

        expect(User.find).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(mockUsers);
    });

    // it("Deve listar usuários paginados com sucesso", async () => {
    //     const mockUsers = [
    //         {
    //             _id: "66efa7559186f4aa94d69eaf",
    //             nome: "Admin",
    //             email: "admin@example.com",
    //             senha: "$2b$10$RPnN.svOABK60Tz991WO5.SJANvXC1NYMx9MPKvGeB0Od0oxeznGC",
    //             papel: "Administrador",
    //             __v: 0
    //         },
    //         {
    //             _id: "66efa7559186f4aa94d69eb1",
    //             nome: "User",
    //             email: "user@example.com",
    //             senha: "$2b$10$nH54XQ0QgR9kWsiQHEHMrez/54URjp.Krf5SI9ZtAerhOJ/Z9KQyi",
    //             papel: "Usuário",
    //             __v: 0
    //         },
    //         {
    //             _id: "66efa86d4d6f178029607e65",
    //             nome: "John Doe",
    //             email: "john@example.com",
    //             senha: "$2b$10$hc74TadMGPL3Nq6kF5pRAOG4O72NDQnVqocjTPIbAEMqVcQfn79Ni",
    //             papel: "Desenvolvedor",
    //             __v: 0
    //         }
    //     ];

    //     (User.find as jest.Mock).mockResolvedValue(mockUsers);
    //     (User.countDocuments as jest.Mock).mockResolvedValue(3);

    //     req = {
    //         query: { page: "1", limit: "10" }, // Valores de query
    //     };

    //     await listAllUsersPaginated(req as Request, res as Response);

    //     // Calcule o skip corretamente
    //     const limit = parseInt(req.query.limit);
    //     const page = parseInt(req.query.page);
    //     const skip = (page - 1) * limit;

    //     // Ajuste aqui para refletir como a função utiliza skip e limit
    //     expect(User.find).toHaveBeenCalledWith({}, { skip, limit });
    //     expect(User.countDocuments).toHaveBeenCalledWith({});
    //     expect(status).toHaveBeenCalledWith(200);
    //     expect(json).toHaveBeenCalledWith({
    //         users: mockUsers,
    //         totalUsers: 3,
    //         totalPages: 1,
    //         currentPage: 1,
    //     });
    // });


    it("Deve listar contagem de usuários por papel com sucesso", async () => {
        const mockAggregate = [
            { _id: "Desenvolvedor", count: 1 },
            { _id: "Administrador", count: 1 },
            { _id: "Usuário", count: 1 },
        ];
        (User.aggregate as jest.Mock).mockResolvedValue(mockAggregate);
        (User.countDocuments as jest.Mock).mockResolvedValue(3);

        await getUsersByRole(req as Request, res as Response);

        expect(User.aggregate).toHaveBeenCalled();
        expect(User.countDocuments).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith([
            { _id: "Total de Usuários", count: 3 },
            { _id: "Desenvolvedor", count: 1 },
            { _id: "Administrador", count: 1 },
            { _id: "Usuário", count: 1 },
        ]);
    });
});
