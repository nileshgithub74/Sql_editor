import '../styles/AssignmentHeader.css';

const AssignmentHeader = ({ assignment }) => {

  if (!assignment) return null;

  return (
    <div className="assignment-header">
      <div className="title-assign">
        <h1>{assignment.title}</h1>

        <span className={assignment.difficulty.toLowerCase()}
        >
          {assignment.difficulty}
        </span>
      </div>
      <p>{assignment.description}</p>
    </div>
  );
};

export default AssignmentHeader;