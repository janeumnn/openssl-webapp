import React, { useRef } from 'react';
import { useStore } from '../../contexts/store';

import './CommandLine.css';

function CommandLine({ runCommand, result }) {
  const { state, dispatch } = useStore();
  const input = useRef();

  const diplayResult = (result) => {
    if (result.text) {
      return `${result.stderr}\n\n${result.text}`;
    }
    if (result.stdout) {
      return result.stdout;
    }
    return result.stderr;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_COMMAND', command: input.current.value });
    runCommand(input.current.value);
    input.current.value = '';
  };

  return (
    <div className="CommandLine">
      <div className="CommandLine-output">
        <p className="CommandLine-command">{state.command ? `OpenSSL> ${state.command}` : ``}</p>
        {state.isLoading ? (
          <div className="CommandLine-loader">
            <div className="spinner-border text-light" role="status"></div>
          </div>
        ) : (
          <p>{diplayResult(result)}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="CommandLine-input">
          <label>OpenSSL&gt;</label>
          <input ref={input} type="text" spellCheck="false"></input>
        </div>
      </form>
    </div>
  );
}

export default CommandLine;
