import { Router } from 'express';
const votesRouter = Router();

votesRouter.get('/', (req, res) => {
    res.send({message: "Votes endpoint hit"});
});

export default votesRouter;