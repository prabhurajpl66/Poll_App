import Option from "../models/options.model.js";
import Poll from "../models/poll.model.js";
import Vote from "../models/votes.model.js";


export const createPollService = async(question, session) =>{
   return await Poll.create([{ question }], { session });

}

export const createOptionService = async (optionDocs,session) =>{
    return await Option.insertMany(optionDocs, { session });
}

export const getPollService = async (pollId) =>{
    return  await Poll.findById(pollId).lean();
}

export const getOptionService = async (optionId) =>{
    return await Option.find({optionId}).lean();
}

export const getAllPollService = async() =>{
    return  await Poll.find().lean()
}

export const getAllOptionsService= async(pollId) =>{
    return  await Option.find({ pollId: pollId }).lean();
}

// export const getselectedPollService = async(pollId) =>{
//    return await Poll.findById(pollId).lean();
// }


export const getVoteByIdService = async(pollId,userId) =>{
    return await Vote.findOne({ pollId, userId });
}

export const saveVote = async(pollId, optionId, userId) =>{
    const vote = new Vote({ pollId, optionId, userId });
    return await vote.save();

}

export const getVoteUserService = async(userId) =>{
    return await Vote.find({ userId }).lean();
}

export const getOptiontextServices = async (optionId) =>{
   return await Option.findById(optionId).lean();
}