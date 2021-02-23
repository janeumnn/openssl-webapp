import React, { useState, useEffect } from 'react';
import { FormFile } from 'react-bootstrap';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { downloadFile } from '../../utils/downloadFile';

import './App.css';

const command = new Command();
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function App() {
  const [inputFiles, setInputFiles] = useState([]);

  const [stdout, setStdout] = useState();
  const [stderr, setStderr] = useState();
  const [text, setText] = useState();
  const [file, setFile] = useState();

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
      }

      if (value.stdout) {
        setStdout(value.stdout);
      } else {
        setStdout(null);
      }

      if (value.stderr) {
        setStderr(value.stderr);
      } else {
        setStderr(null);
      }

      if (value.text) {
        setText(value.text);
      } else {
        setText(null);
      }

      if (value.file) {
        setFile(value.file);
        downloadFile(value.file, value.file.name, null);
      }
    });

    return () => {
      result.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <FormFile className="mt-3 mb-3" custom>
        <FormFile.Input onChange={(e) => setInputFiles([...e.target.files])} multiple />
        <FormFile.Label data-browse="Browse...">
          {inputFiles.length ? inputFiles.map((f) => f.name).join(', ') : 'No files selected'}
        </FormFile.Label>
      </FormFile>
      <CommandLine
        commandArgs={runCommand}
        result={stdout ?? stderr}
        isLoading={isLoading}
      ></CommandLine>
    </div>
  );
}

export default App;
