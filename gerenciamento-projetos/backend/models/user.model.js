const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "O nome do usuário é obrigatório"],
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
  },
  senha: {
    type: String,
    required: [true, "Digite uma senha"],
  },
  papel: {
    type: String,
    enum: ["Desenvolvedor", "Administrador", "Usuário"],
    required: true,
  },
});

// Pre-save hook para hash da senha antes de salvar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  const salt = await bcrypt.genSalt();
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método estático para logar
UserSchema.statics.login = async function (email, senha) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(senha, user.senha);
    if (auth) {
      return user;
    }
    throw Error("senha incorreta");
  }
  throw Error("email incorreto");
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
