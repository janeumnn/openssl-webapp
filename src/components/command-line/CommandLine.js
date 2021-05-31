import React, { useRef, useState } from 'react';
import { useStore } from '../../contexts/store';

import './CommandLine.css';

function CommandLine({ runCommand, result }) {
  const { state, dispatch } = useStore();
  const [command, setCommand] = useState('');
  const input = useRef();
  const commandHistory = useRef({
    selectedIndex: -1,
    commands: [],
  });

  const addToCommandHistory = (command) => {
    if (commandHistory.current.commands.findIndex((x) => x === command) === -1)
      commandHistory.current.commands.unshift(command);
    if (commandHistory.current.length > 10) commandHistory.current.commands.pop();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.current.value.replace(/\s/g, '')) {
      addToCommandHistory(input.current.value);
      dispatch({ type: 'SET_COMMAND', command: input.current.value });
      runCommand(input.current.value);
      setCommand('');
      commandHistory.current.selectedIndex = -1;
    }
  };

  const handleOnChange = (event) => {
    setCommand(event.target.value);
    commandHistory.current.selectedIndex = -1;
  };

  const handleOnKeyDown = (event) => {
    let selectedIndex = commandHistory.current.selectedIndex;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex += 1;
        if (selectedIndex < 10 && commandHistory.current.commands[selectedIndex]) {
          input.current.value = commandHistory.current.commands[selectedIndex];
          commandHistory.current.selectedIndex = selectedIndex;
        }
        return;
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex -= 1;
        if (selectedIndex >= 0 && commandHistory.current.commands[selectedIndex]) {
          input.current.value = commandHistory.current.commands[selectedIndex];
          commandHistory.current.selectedIndex = selectedIndex;
        }

        if (selectedIndex === -1) {
          input.current.value = command;
          commandHistory.current.selectedIndex = selectedIndex;
        }
        return;
      default:
        return;
    }
  };

  return (
    <div className="CommandLine">
      <div className="CommandLine-output">
        {state.command && <p className="CommandLine-command">{`OpenSSL> ${state.command}`}</p>}
        {state.isLoading ? (
          <div className="CommandLine-loader">
            <div className="spinner-border text-light" role="status"></div>
          </div>
        ) : (
          <>
            {result.stderr && <p>{`${result.stderr}\n`}</p>}
            {result.stdout && <p>{result.stdout}</p>}
          </>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="CommandLine-input">
          <label>OpenSSL&gt;</label>
          <input
            ref={input}
            type="text"
            spellCheck="false"
            value={command}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default CommandLine;
