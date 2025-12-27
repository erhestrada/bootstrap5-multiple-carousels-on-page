import { Router } from 'express';
const usersRouter = Router();

usersRouter.get('/', (req, res) => {
    res.send({message: "Users endpoint hit"});
});

export default usersRouter;