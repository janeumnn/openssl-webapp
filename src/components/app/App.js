import './App.css';

import React, { useState, useEffect, useRef } from 'react';
import Command from '../../core/command';
import { downloadFile } from '../../utils/downloadFile';

function App() {
  const command = useRef(new Command());

  const [stdout, setStdout] = useState();
  const [stderr, setStderr] = useState();
  const [text, setText] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    const result = command.current.resultAsObservable.subscribe((value) => {
      if (value.stdout) {
        setStdout(value.stdout);
      }

      if (value.stderr) {
        setStderr(value.stderr);
      }

      if (value.text) {
        setText(value.text);
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
      <header className="App-header">
        <p>
          <code>OpenSSL WebApp</code>
        </p>
      </header>
    </div>
  );
}

export default App;
