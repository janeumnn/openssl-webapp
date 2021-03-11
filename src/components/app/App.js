import React, { useState, useEffect } from 'react';
import { FormFile } from 'react-bootstrap';
import CardControl from '../card-control/CardControl';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { useStore } from '../../contexts/store';
import { downloadFile } from '../../utils/downloadFile';

import './App.css';

const command = new Command();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function App() {
  const { dispatch } = useStore();
  const [output, setOutput] = useState({ stdout: '', stderr: '', text: '', file: null });
  const [inputFiles, setInputFiles] = useState([]);

  const runCommand = async (args, text = '') => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    await delay(30);
    if (text && inputFiles.length) {
      await command.run(args, inputFiles, text);
    } else if (text) {
      await command.run(args, null, text);
    } else if (inputFiles.length) {
      await command.run(args, inputFiles, null);
    } else {
      await command.run(args);
    }
  };

  useEffect(() => {
    const result = command.resultAsObservable.subscribe((value) => {
      if (value) {
        dispatch({ type: 'SET_LOADING', isLoading: false });
        setOutput(value);
        if (value.file) {
          downloadFile(value.file, value.file.name, null);
        }
      }
    });

    return () => {
      result.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInputChange = (event) => {
    setInputFiles([...event.target.files]);
    dispatch({
      type: 'SET_FILENAMES',
      fileNames: [...event.target.files].map((file) => file.name),
    });
  };

  return (
    <div className="App">
      <label>Input</label>
      <FormFile className="mb-3" custom>
        <FormFile.Input onChange={handleFileInputChange} multiple />
        <FormFile.Label data-browse="Browse...">
          {inputFiles.length ? inputFiles.map((file) => file.name).join(', ') : 'Select files...'}
        </FormFile.Label>
      </FormFile>
      <CardControl runCommand={runCommand}></CardControl>
      <label className="mt-3">Output</label>
      <CommandLine
        runCommand={runCommand}
        result={{ stdout: output.stdout, stderr: output.stderr, text: output.text }}
      ></CommandLine>
    </div>
  );
}

export default App;
