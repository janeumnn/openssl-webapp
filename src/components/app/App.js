import React, { useState, useEffect } from 'react';
import { FormFile } from 'react-bootstrap';
import CardControl from '../card-control/CardControl';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { downloadFile } from '../../utils/downloadFile';

import './App.css';

const command = new Command();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function App() {
  const [output, setOutput] = useState({ stdout: '', stderr: '', text: '', file: null });
  const [inputFiles, setInputFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const runCommand = async (args) => {
    setIsLoading(true);
    await delay(10);
    if (inputFiles.length) {
      await command.run(args, inputFiles);
    } else {
      await command.run(args);
    }
  };

  useEffect(() => {
    const result = command.resultAsObservable.subscribe((value) => {
      if (value) {
        setIsLoading(false);
        setOutput(value);
        if (value.file) {
          downloadFile(value.file, value.file.name, null);
        }
      }
    });

    return () => {
      result.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <CardControl></CardControl>
      <FormFile className="mt-3 mb-3" custom>
        <FormFile.Input onChange={(e) => setInputFiles([...e.target.files])} multiple />
        <FormFile.Label data-browse="Browse...">
          {inputFiles.length ? inputFiles.map((f) => f.name).join(', ') : 'Select files...'}
        </FormFile.Label>
      </FormFile>
      <CommandLine
        runCommand={runCommand}
        result={{ stdout: output.stdout, stderr: output.stderr, text: output.text }}
        isLoading={isLoading}
      ></CommandLine>
    </div>
  );
}

export default App;
