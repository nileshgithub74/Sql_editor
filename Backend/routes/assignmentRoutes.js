import express from 'express';
import { 
  getAllAssignments, 
  getAssignmentById
} from '../controller/assignmentController.js';

const router = express.Router();

router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);

export default router;