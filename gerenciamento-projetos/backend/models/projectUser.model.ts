import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model"; 
import { IProject } from "./project.model"; 

export interface IProjectUser extends Document {
  usuario_id: IUser["_id"];
  projeto_id: IProject["_id"];
}

const projectUserSchema: Schema<IProjectUser> = new Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projeto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const ProjectUser = mongoose.model<IProjectUser>("ProjectUser", projectUserSchema);

export default ProjectUser;
