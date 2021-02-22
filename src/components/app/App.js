import React, { useState, useEffect, useRef } from 'react';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { downloadFile } from '../../utils/downloadFile';

import './App.css';

const command = new Command();
const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function App() {
  const [stdout, setStdout] = useState();
  const [stderr, setStderr] = useState();
  const [text, setText] = useState();
  const [file, setFile] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const runCommand = async (args) => {
    setIsLoading(true);
    await delay(10);
    await command.run(args);
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
      <CommandLine
        commandArgs={runCommand}
        result={stdout ?? stderr}
        isLoading={isLoading}
      ></CommandLine>
    </div>
  );
}

export default App;
