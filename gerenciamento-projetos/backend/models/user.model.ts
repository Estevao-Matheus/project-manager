import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define the user interface
export interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  papel: "Desenvolvedor" | "Administrador" | "Usuário";
}

// Define static methods for the user model
interface IUserModel extends Model<IUser> {
  login(email: string, senha: string): Promise<IUser>;
}

// Define the user schema
const UserSchema: Schema<IUser> = new Schema({
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

// Pre-save hook to hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("senha")) return next();

  const salt = await bcrypt.genSalt();
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Static method for logging in a user
UserSchema.statics.login = async function (email: string, senha: string): Promise<IUser> {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(senha, user.senha);
    if (auth) {
      return user;
    }
    throw new Error("senha incorreta");
  }
  throw new Error("email incorreto");
};

// Export the User model
const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
export default User;
