import React, { useRef } from 'react';
import { useStore } from '../../contexts/store';

import './CommandLine.css';

function CommandLine({ runCommand, result }) {
  const { state, dispatch } = useStore();
  const input = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_COMMAND', command: input.current.value });
    runCommand(input.current.value);
    input.current.value = '';
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
          <input ref={input} type="text" spellCheck="false"></input>
        </div>
      </form>
    </div>
  );
}

export default CommandLine;
