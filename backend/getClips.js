import { Router } from 'express';
const clipsRouter = Router();

clipsRouter.get('/top', (req, res) => {
    res.send({message: "Top clips endpoint hit"});
});

export default clipsRouter;
