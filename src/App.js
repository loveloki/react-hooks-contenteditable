import React, { useState } from 'react';
import './App.css';
import Editing from './Editing';

function App() {
  const [content, setContent] = useState("input some text...")

  const handleChange = (event, text) => {
    setContent(text)
  }

  const handleKeyDown = (event, text) => {

  }

  return (
    <Editing
      focus
      content={content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
       />
  );
}

export default App;
