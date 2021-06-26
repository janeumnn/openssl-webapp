import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import CardControl from '../card-control/CardControl';
import CommandLine from '../../components/command-line/CommandLine';
import Command from '../../core/command';
import { useStore } from '../../contexts/store';
import { useTranslation } from 'react-i18next';

import './App.css';

const command = new Command();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function CardDescription({ close }) {
  const { t } = useTranslation('translation');

  return (
    <Card className="mb-3">
      <Card.Header className="bg-transparent border-bottom-0">
        <button type="button" className="close no-after" onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
      </Card.Header>
      <Card.Body className="mt-n5">
        <Card.Title>{t('cardDescription.title')}</Card.Title>
        <Card.Text>{t('cardDescription.text')}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function App() {
  const { state, dispatch } = useStore();
  const [output, setOutput] = useState({ stdout: '', stderr: '', file: null });
  const [showDescription, setShowDescription] = useState(true);

  const runCommand = async (args, commandType = '', text = '') => {
    const files = state.files.map((item) => item.file);
    dispatch({ type: 'SET_LOADING', isLoading: true });
    await delay(125);

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
        await command.run(args, files, text);
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
      {showDescription && (
        <CardDescription close={() => setShowDescription(false)}></CardDescription>
      )}
      <CardControl runCommand={runCommand}></CardControl>
      <CommandLine
        runCommand={runCommand}
        result={{ stdout: output.stdout, stderr: output.stderr }}
      ></CommandLine>
    </div>
  );
}

export default App;
