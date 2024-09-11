const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
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

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
