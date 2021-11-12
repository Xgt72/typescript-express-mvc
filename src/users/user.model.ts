import * as mongoose from "mongoose";
import User from "./user.interface";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
