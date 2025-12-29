import { Router } from 'express';
const votesRouter = Router();

votesRouter.get('/t', (req, res) => {
    res.send({message: "Votes endpoint hit"});
});

export default votesRouter;