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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (checkValidation()) {
      const command = buildGenrsa(genrsa);
      dispatch({ type: 'SET_COMMAND', command: command });
      runCommand(command);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Row className="justify-content-start">
        <Col md={2}>
          <Form.Group>
            <Form.Check type="checkbox" className="mb-2">
              <Form.Check.Input
                type="checkbox"
                checked={genrsa.out}
                onChange={set('out')}
              ></Form.Check.Input>
              <Form.Check.Label>File output</Form.Check.Label>
            </Form.Check>
            <Form.Control
              as="input"
              value={genrsa.outFile}
              onChange={set('outFile')}
              disabled={!genrsa.out}
              isInvalid={validation.fileOutput}
            ></Form.Control>
            <Form.Control.Feedback type="invalid">No text input</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label className="mb-2">Numbits</Form.Label>
            <Form.Control as="select" value={genrsa.numbits} onChange={set('numbits')} custom>
              {NUMBITS.map((numbits) => (
                <option key={numbits}>{numbits}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Form.Row>
      <Button type="submit" disabled={state.isLoading}>
        Execute
      </Button>
    </Form>
  );
}

export default TabGenrsa;
