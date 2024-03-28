import React, { useState, useRef } from 'react';
import './App.css';
import axios from 'axios';

function DragDropTxtUploader() {
  const [files, setFiles] = useState([]);
  const [textContents, setTextContents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const selectFiles = () => {
    fileInputRef.current.click();
  };

  const onFileSelect = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length === 0) return;

    const updatedFiles = [...files];
    const updatedTextContents = [...textContents];
    const invalidFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Check if file is a .txt file
      if (file.type === 'text/plain') {
        updatedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          updatedTextContents.push(e.target.result);
          setTextContents(updatedTextContents);
        };
        reader.readAsText(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    setFiles(updatedFiles);

    // Throw error if invalid files were selected
    if (invalidFiles.length > 0) {
      alert(`Error: The following files are not .txt files: ${invalidFiles.join(', ')}`);
      // You can also handle the error in a different way, such as displaying an error message in the UI
    }
  };


  const deleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedTextContents = textContents.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setTextContents(updatedTextContents);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    const updatedFiles = [...files];
    const updatedTextContents = [...textContents];

    for (let i = 0; i < droppedFiles.length; i++) {
      updatedFiles.push(droppedFiles[i]);

      if (droppedFiles[i].type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          updatedTextContents.push(e.target.result);
          setTextContents(updatedTextContents);
        };
        reader.readAsText(droppedFiles[i]);
      }
    }

    setFiles(updatedFiles);
  };

  const handleFinal = () => [
    // console.log(textContents)
  ]

  return (
    <div
      className={`card ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="top">
        <p>Drag & Drop or Browse to upload .txt files</p>
      </div>
      <div className="drag-area" onClick={selectFiles}>
        {isDragging ? (
          <span className="select">Drop file here</span>
        ) : (
          <span className="select">Drag & Drop or Browse to upload .txt files</span>
        )}
        <input
          type="file"
          className="file"
          multiple
          ref={fileInputRef}
          onChange={onFileSelect}
        />
      </div>
      <div className="container">
        {files.map((file, index) => (
          <div className="file-item" key={index}>
            <span className="delete" onClick={() => deleteFile(index)}>&times;</span>
            <span>{file.name}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => handleFinal()}>Upload</button>
      <div className="text-result-container">
        <h2>Text Result:</h2>
        {textContents.map((content, index) => (
          <div key={index}>
            <h3>{files[index].name}</h3>
            <pre>{content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DragDropTxtUploader;
