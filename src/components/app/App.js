import React, { useState, useEffect, useRef } from 'react';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { downloadFile } from '../../utils/downloadFile';

import './App.css';

function App() {
  const command = useRef(new Command());

  const [stdout, setStdout] = useState();
  const [stderr, setStderr] = useState();
  const [text, setText] = useState();
  const [file, setFile] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const runCommand = (args) => {
    setIsLoading(true);
    command.current.run(args);
  };

  useEffect(() => {
    const result = command.current.resultAsObservable.subscribe((value) => {
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
