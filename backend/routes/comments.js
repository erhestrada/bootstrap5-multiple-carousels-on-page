import { Router } from 'express';
const commentsRouter = Router();

commentsRouter.get('/', (req, res) => {
    res.send({message: "Comments endpoint hit"});
});

export default commentsRouter;
