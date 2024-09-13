import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  nome: string;
  descricao: string;
  data_inicio: Date;
  data_fim: Date;
  status: "Em andamento" | "Concluído" | "Pendente";
}

// Define the project schema
const ProjectSchema: Schema<IProject> = new Schema({
  nome: {
    type: String,
    required: [true, "Por favor digite o nome do projeto!"],
  },
  descricao: {
    type: String,
    required: [true, "Por favor descreva o projeto!"],
  },
  data_inicio: {
    type: Date,
    required: true,
  },
  data_fim: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Em andamento", "Concluído", "Pendente"],
    required: true,
  },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
