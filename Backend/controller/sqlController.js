import {
  createWorkspace,
  loadAssignmentData,
  executeUserQuery,
  getSchemaInfo,
  getTableData,
  pool,
} from "../database/postgresql.js";
import { validateAnswer } from "../services/answerValidationService.js";
import Assignment from "../models/assignmentModel.js";



export const loadAssignment = async (req, res) => {
  try {
    const { assignmentId, sessionId } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
    }

    const { _id, title, question, difficulty, sampleTables } = assignment;

    const { schemaId, client } = await createWorkspace(sessionId);

    await loadAssignmentData(client, schemaId, sampleTables);

    const schemaInfo = await getSchemaInfo(client, schemaId);

    const tableData = await getTableData(client, schemaId);

    client.release();

    console.log("Assignment loaded successfully");
    res.json({
      success: true,
      data: {
        schemaId,
        assignment: { _id, title, question, difficulty },
        schema: schemaInfo,
        tables: tableData,
      },
    });
  } catch (error) {
    console.error("Error in loadAssignment:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const executeQuery = async (req, res) => {
  const { query, schemaId } = req.body;

  const client = await pool.connect();
  const result = await executeUserQuery(client, schemaId, query);
  client.release();

  res.json({
    success: true,
    data: result,
  });
};

export const validateUserAnswer = async (req, res) => {
  const { query, assignmentId, schemaId } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  const validation = await validateAnswer(query, assignment, schemaId);

  res.json({
    success: true,
    data: validation,
  });
};
