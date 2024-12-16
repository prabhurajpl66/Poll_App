import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  optionId: { type: mongoose.Schema.Types.ObjectId, ref: "Option", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
