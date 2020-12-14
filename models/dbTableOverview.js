import mongoose from "mongoose";

const tableOverviewSchema = mongoose.Schema({
  id: Number,
  user1: String,
  user2: String,
  user1RankPoints: Number,
  user2RankPoints: Number,
});

export default mongoose.model("tableOverview", tableOverviewSchema);
