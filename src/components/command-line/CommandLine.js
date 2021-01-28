import React, { useRef, useState } from 'react';

import './CommandLine.css';

function CommandLine({ commandArgs, result }) {
  const input = useRef();
  const [command, setCommand] = useState();

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setCommand(`OpenSSL> ${input.current.value}`);
    commandArgs(input.current.value);
    input.current.value = '';
  };

  return (
    <div className="CommandLine">
      <div className="CommandLine-output">
        <p className="CommandLine-command">{command}</p>
        <p>{result}</p>
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
