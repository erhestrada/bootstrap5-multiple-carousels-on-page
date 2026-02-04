import { Router } from 'express';
const historyRouter = Router();

historyRouter.get('/', (req, res) => {
    res.send({message: "History endpoint hit"});
});

export default historyRouter;

