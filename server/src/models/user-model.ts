import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
