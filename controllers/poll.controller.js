import mongoose from "mongoose";
import Poll from "../models/poll.model.js";
import {
  createOptionService,
  createPollService,
  getAllOptionsService,
  getAllPollService,
  getOptionService,
  getOptiontextServices,
  getPollService,
  getVoteByIdService,
  getVoteUserService,
  saveVote,
} from "../services/poll.service.js";



export const CreatePOll = async (req, res) => {
  const { question, options } = req.body;

  if (
    !question ||
    !options ||
    !Array.isArray(options) ||
    options.length === 0
  ) {
    return res.status(400).json({ error: "Invalid poll data provided." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newPoll = await createPollService(question, session);
    const pollId = newPoll[0]._id;

    const optionDocs = options.map((optionText) => ({
      pollId,
      optionText,
    }));

    await createOptionService(optionDocs, session);

    await session.commitTransaction();
    session.endSession();

    const createdPoll = await getPollService(pollId);
    const createdOptions = await getOptionService(pollId);

    res.status(201).json({
      poll: {
        id: createdPoll._id,
        question: createdPoll.question,
        options: createdOptions.map((opt) => ({
          id: opt._id,
          optionText: opt.optionText,
        })),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating poll:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the poll." });
  }
};

export const getAllPolls = async (req, resp) => {
  try {
    const polls = await getAllPollService()

    const results = await Promise.all(
      polls.map(async (poll) => {
        const options = await getAllOptionsService(poll._id)
        return {
          id: poll._id,
          question: poll.question,
          options: options.map((opt) => ({
            id: opt._id,
            optionText: opt.optionText,
          })),
        };
      })
    );

    resp.status(200).json(results);
  } catch (error) {
    console.error("Error fetching polls:", error);
    resp.status(500).json({ error: "An error occurred while fetching polls." });
  }
};

export const getPoll = async (req, resp) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return resp.status(404).json({ message: "Invalid id" });
  }
  try {

    const poll = await getPollService(id)
    if (!poll) {
      return resp.status(404).json({ error: "Poll not found." });
    }

    const options = await getAllOptionsService(id)

    resp.status(200).json({
      id: poll._id,
      question: poll.question,
      options: options.map((opt) => ({
        id: opt._id,
        optionText: opt.optionText,
      })),
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    resp.status(500).json({ error: "An error occurred while fetching the poll." });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId, userId } = req.body;

    // Validate Poll ID
    const poll = await getPollService(pollId)
    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    const option = await getOptionService(optionId)
    if (!option) {
      return res.status(404).json({ error: "Option not found for this poll." });
    }

    const existingVote = await getVoteByIdService(pollId,userId)
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted in this poll." });
    }

    const vote = await saveVote(pollId, optionId, userId)
    
    res.status(201).json({ message: "Vote recorded successfully.", vote });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ error: "An error occurred while voting." });
  }
};


export const getResult = async(req, res) =>{
  try {
    const { userId } = req.params;

    const votes = await getVoteUserService(userId)
    
    if (votes.length === 0) {
      return res.status(200).json({ message: "No poll results found for this user." });
    }
    const results = await Promise.all(
      votes.map(async (vote) => {
        const poll = await getPollService(vote.pollId)
        const option = await getOptiontextServices(vote.optionId)
        
        return {
          pollId: vote.pollId,
          question: poll?.question || "Poll not found",
          optionId: vote.optionId,
          optionText:option?.optionText || "Option not found",
        voteDate: vote.createdAt,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching poll results:", error);
    res.status(500).json({ error: "An error occurred while fetching poll results." });
  }

}