import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  login: String,
  password: String,
  rankPoints: Number,
  isAdmin: Boolean,
});

export default mongoose.model("user", userSchema);
