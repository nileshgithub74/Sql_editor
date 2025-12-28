import Assignment from '../models/assignmentModel.js';


export const getAllAssignments = async (req, res) => {
  const assignments = await Assignment.find({ isActive: true });
  res.json({
    success: true,
    allAssignment: assignments
  });
};


export const getAssignmentById = async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);
  res.json({
    success: true,
    data: assignment
  });
};

