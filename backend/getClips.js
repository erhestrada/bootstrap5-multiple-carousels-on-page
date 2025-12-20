import { Router } from 'express';
const router = Router();

router.get('/clips/top', (req, res) => {
    res.send({message: "Top clips endpoint hit"});
});

export default router;
