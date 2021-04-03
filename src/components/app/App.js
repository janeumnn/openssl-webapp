import React, { useState, useEffect } from 'react';
import CardControl from '../card-control/CardControl';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { useStore } from '../../contexts/store';

import './App.css';

const command = new Command();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function App() {
  const { state, dispatch } = useStore();
  const [output, setOutput] = useState({ stdout: '', stderr: '', file: null });

  const runCommand = async (args, commandType = '', text = '') => {
    const files = state.files.map((item) => item.file);
    dispatch({ type: 'SET_LOADING', isLoading: true });
    await delay(50);

    switch (commandType) {
      case 'enc':
        await command.run(args, files, text);
        break;
      case 'genrsa':
        await command.run(args, null, null);
        break;
      case 'rsa':
        await command.run(args, files, null);
        break;
      case 'dgst':
        await command.run(args, files, null);
        break;
      default:
        await command.run(args, files);
        break;
    }
  };

  useEffect(() => {
    const result = command.resultAsObservable.subscribe((value) => {
      if (value) {
        dispatch({ type: 'SET_LOADING', isLoading: false });
        setOutput(value);
        if (value.file && value.file.size !== 0) {
          dispatch({ type: 'ADD_FILES', items: [{ file: value.file, output: true }] });
        }
      }
    });

    return () => {
      result.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <CardControl runCommand={runCommand}></CardControl>
      <label className="mt-3">Output</label>
      <CommandLine
        runCommand={runCommand}
        result={{ stdout: output.stdout, stderr: output.stderr }}
      ></CommandLine>
    </div>
  );
}

export default App;
