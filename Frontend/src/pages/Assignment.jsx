import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AssignmentHeader from "../component/AssignmentHeader";
import Sidebar from "../component/Sidebar";
import QueryPanel from "../component/QueryPanel";
import axios from "axios";
import API_CONFIG from "../config/api";
import '../styles/Assignment.css';

const Assignment = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [results, setResults] = useState(null);
  const [validation, setValidation] = useState(null);
  const [schemaId, setSchemaId] = useState(null);
  const [tables, setTables] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs for scrolling
  const resultsRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  // Auto-scroll when results are shown/hidden
  useEffect(() => {
    if (showResults && resultsRef.current) {
      // Scroll to results with smooth animation
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } else if (!showResults && editorRef.current) {
      // Scroll back to editor with smooth animation
      setTimeout(() => {
        editorRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showResults]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading assignment with ID:', id);
      console.log('API URL:', API_CONFIG.BASE_URL);
      
      const response = await axios.post(`${API_CONFIG.BASE_URL}/sql/assignment/load`, {
        assignmentId: id,
        sessionId: `session_${Date.now()}`
      });
      
      console.log('Assignment loaded:', response.data);
      
      setAssignment(response.data.data.assignment);
      setSchemaId(response.data.data.schemaId);
      setTables(response.data.data.tables || []);
    } catch (error) {
      console.error('Error loading assignment:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Failed to load assignment. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (query) => {
    try {
      console.log('Executing query:', query);
      console.log('Schema ID:', schemaId);
      
      const executeResponse = await axios.post(`${API_CONFIG.BASE_URL}/sql/query/execute`, {
        query,
        schemaId
      });
      
      console.log('Query results:', executeResponse.data);
      setResults(executeResponse.data.data);
      
      const validateResponse = await axios.post(`${API_CONFIG.BASE_URL}/sql/query/validate`, {
        query,
        assignmentId: assignment._id,
        schemaId: schemaId
      });
      
      console.log('Validation results:', validateResponse.data);
      setValidation(validateResponse.data.data);
      
      // Automatically show results after running query
      setShowResults(true);
    } catch (error) {
      console.error('Error executing query:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  return (
    <div className="assignment">
      {loading && <div className="loading">Loading assignment...</div>}
      {error && <div className="error">{error}</div>}
      {assignment && (
        <>
          <AssignmentHeader assignment={assignment} />
          
          <div className="content">
            <Sidebar assignment={assignment} tables={tables} />
            <QueryPanel 
              onExecute={executeQuery}
              results={results}
              validation={validation}
              showResults={showResults}
              onToggleResults={toggleResults}
              resultsRef={resultsRef}
              editorRef={editorRef}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Assignment;