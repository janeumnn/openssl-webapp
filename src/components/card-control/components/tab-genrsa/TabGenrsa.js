import { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';
import { buildGenrsa } from '../../../../core/commandBuilder';

import './TabGenrsa.css';

const NUMBITS = ['1024', '2048', '4096'];

function TabGenrsa({ runCommand }) {
  const { state, dispatch } = useStore();
  const [validation, setValidation] = useState({
    fileOutput: false,
  });
  const [genrsa, setGenrsa] = useState({
    out: false,
    outFile: 'id_rsa',
    numbits: NUMBITS[0],
  });

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    switch (key) {
      case 'out':
        setGenrsa((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileOutput: false }));
        break;
      case 'outFile':
        setGenrsa((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileOutput: false }));
        break;
      default:
        setGenrsa((prev) => ({ ...prev, [key]: value }));
        break;
    }
  };

  const checkValidation = () => {
    let valid = true;
    if (!genrsa.outFile) {
      setValidation((prev) => ({ ...prev, fileOutput: true }));
      valid = false;
    }
    return valid;
  };

  const execute = () => {
    if (checkValidation()) {
      const command = buildGenrsa(genrsa);
      dispatch({ type: 'SET_COMMAND', command: command });
      runCommand(command);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} md={5}>
          <Form.Check
            id="genrsa-file-out"
            type="checkbox"
            className="mb-2"
            label="File output"
            checked={genrsa.out}
            onChange={set('out')}
            custom
          />
          <Form.Control
            as="input"
            value={genrsa.outFile}
            onChange={set('outFile')}
            disabled={!genrsa.out}
            isInvalid={validation.fileOutput}
          />
          <Form.Control.Feedback type="invalid">No text input</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md={5}>
          <Form.Label className="mb-2">Numbits</Form.Label>
          <Form.Control as="select" value={genrsa.numbits} onChange={set('numbits')} custom>
            {NUMBITS.map((numbits) => (
              <option key={numbits}>{numbits}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Button type="button" onClick={execute} disabled={state.isLoading}>
        Execute
      </Button>
    </Form>
  );
}

export default TabGenrsa;
