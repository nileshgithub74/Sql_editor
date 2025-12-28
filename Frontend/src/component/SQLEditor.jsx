import { useState } from "react";
import Editor from '@monaco-editor/react';
import '../styles/SQLEditor.css';

const SQLEditor = ({ onExecute }) => {
  const [query, setQuery] = useState("");

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query);
    }
  };

  return (
    <div className="sql-editor">
      <div className="editor-header">
        <button onClick={handleExecute} className="run-button">Run</button>
        <button onClick={() => setQuery('')} className="clear-button">Clear</button>
      </div>
      
      <div className="editor-content">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || "")}
          onMount={(editor, monaco) => {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
              handleExecute();
            });
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            lineNumbers: 'on',
            automaticLayout: true,
            wordWrap: 'on',
          }}
          theme="vs-dark"
        />
      </div>
      
      <div className="editor-footer">
        <span>Press Ctrl+Enter to run the code...</span>
      </div>
    </div>
  );
};

export default SQLEditor;