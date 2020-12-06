import mongoose from "mongoose";

const tableOverviewSchema = mongoose.Schema({
  id: Number,
  user1: String,
  user2: String,
});

export default mongoose.model("tableOverview", tableOverviewSchema);