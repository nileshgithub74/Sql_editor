import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  question: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  hints: [{
    type: String
  }],
  sampleTables: [{
    tableName: {
      type: String,
      required: true
    },
    columns: [{
      columnName: {
        type: String,
        required: true
      },
      dataType: {
        type: String,
        required: true
      }
    }],
    rows: [{
      type: mongoose.Schema.Types.Mixed,
    }]
  }],
  expectedOutput: {
    type: {
      type: String,
      enum: ['table', 'single_value', 'column', 'row', 'count'],
      default: 'table'
    },
    value: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;