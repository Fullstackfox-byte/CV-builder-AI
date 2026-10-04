import { Router } from 'express';
import clientId from '../middleware/clientId.js';
import requireDB from '../middleware/requireDB.js';
import { listCVs, getCV, saveCV, deleteCV } from '../controllers/cvController.js';

const router = Router();
router.use(requireDB, clientId);
router.get('/', listCVs);
router.get('/:cvId', getCV);
router.put('/:cvId', saveCV);
router.delete('/:cvId', deleteCV);

export default router;
