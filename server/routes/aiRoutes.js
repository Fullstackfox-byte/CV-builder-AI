import { Router } from 'express';
import * as c from '../controllers/aiController.js';

const router = Router();
router.post('/summary', c.summary);
router.post('/objective', c.objective);
router.post('/project-bullets', c.projectBullets);
router.post('/experience-bullets', c.experienceBullets);
router.post('/follow-up', c.followUp);
router.post('/improve', c.improve);
router.post('/optimize', c.optimize);
router.post('/full-cv', c.fullCV);

export default router;
