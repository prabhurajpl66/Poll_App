import expres from "express";
import { CreatePOll, getAllPolls, getPoll, getResult, votePoll } from "../controllers/poll.controller.js";

const pollRouter = expres.Router();

pollRouter.post("/new_poll",CreatePOll)
pollRouter.get("/polllist",getAllPolls)
pollRouter.get("/poll/:id",getPoll)
pollRouter.post("/polls/:pollId/vote",votePoll)
pollRouter.get("/users/:userId/results",getResult)


export default pollRouter