import { Router } from 'express';
const favoritesRouter = Router();

favoritesRouter.get('/t', (req, res) => {
    res.send({message: "favorites endpoint hit"});
});

export default favoritesRouter;
