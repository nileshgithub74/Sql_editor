import { 
  createWorkspace,
  loadAssignmentData,
  executeUserQuery,
  getSchemaInfo,
  getTableData,
  pool 
} from '../database/postgresql.js';
import { validateAnswer } from '../services/answerValidationService.js';
import Assignment from '../models/assignmentModel.js';

// Load assignment into workspace
export const loadAssignment = async (req, res) => {
  try {
    console.log('=== Load Assignment Request ===');
    console.log('Request body:', req.body);
    
    const { assignmentId, sessionId } = req.body;
    
    console.log('Finding assignment:', assignmentId);
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      console.error('Assignment not found:', assignmentId);
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    console.log('Assignment found:', assignment.title);
    const { _id, title, question, difficulty, sampleTables } = assignment;
    
    console.log('Creating workspace for session:', sessionId);
    const { schemaId, client } = await createWorkspace(sessionId);
    
    console.log('Loading assignment data into schema:', schemaId);
    await loadAssignmentData(client, schemaId, sampleTables);
    
    console.log('Getting schema info');
    const schemaInfo = await getSchemaInfo(client, schemaId);
    
    console.log('Getting table data');
    const tableData = await getTableData(client, schemaId);
    
    client.release();
    
    console.log('Assignment loaded successfully');
    res.json({
      success: true,
      data: {
        schemaId,
        assignment: { _id, title, question, difficulty },
        schema: schemaInfo,
        tables: tableData
      }
    });
  } catch (error) {
    console.error('Error in loadAssignment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Execute SQL query
export const executeQuery = async (req, res) => {
  const { query, schemaId } = req.body;
  
  const client = await pool.connect();
  const result = await executeUserQuery(client, schemaId, query);
  client.release();
  
  res.json({
    success: true,
    data: result
  });
};

// Validate user's answer
export const validateUserAnswer = async (req, res) => {
  const { query, assignmentId, schemaId } = req.body;
  
  const assignment = await Assignment.findById(assignmentId);
  const validation = await validateAnswer(query, assignment, schemaId);
  
  res.json({
    success: true,
    data: validation
  });
};