import { Router } from 'express';
const votesRouter = Router();

usersRouter.get('/', (req, res) => {
    res.send({message: "Users endpoint hit"});
});

export default usersRouter;