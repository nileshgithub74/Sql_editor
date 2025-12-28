import express from 'express';
import { 
  loadAssignment, 
  executeQuery, 
  validateUserAnswer
} from '../controller/sqlController.js';

const router = express.Router();


router.post('/assignment/load', loadAssignment);
router.post('/query/execute', executeQuery);
router.post('/query/validate', validateUserAnswer);

export default router;