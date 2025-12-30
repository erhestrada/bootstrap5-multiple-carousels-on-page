import { Router } from 'express';
const favoritesRouter = Router();

favoritesRouter.get('/', (req, res) => {
    res.send({message: "favorites endpoint hit"});
});

export default favoritesRouter;
