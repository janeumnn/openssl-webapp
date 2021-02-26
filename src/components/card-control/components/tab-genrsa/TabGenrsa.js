import { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';

import './TabGenrsa.css';

const NUMBITS = ['1024', '2048', '4096'];

function TabGenrsa({ runCommand }) {
  const { state, dispatch } = useStore();
  const [genrsa, setGenrsa] = useState({
    out: false,
    outFile: 'id_rsa',
    numbits: NUMBITS[0],
  });

  const commandBuilder = () => {
    let command = ['genrsa'];
    for (const key of Object.keys(genrsa)) {
      switch (key) {
        case 'out':
          if (genrsa.out) command.push('-out');
          break;

        case 'outFile':
          if (genrsa.out) command.push(genrsa.outFile);
          break;

        case 'numbits':
          command.push(genrsa.numbits);
          break;

        default:
          break;
      }
    }
    return command.join(' ');
  };

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setGenrsa((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const command = commandBuilder();
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command);
  };

  return (
    <Form onSubmit={handleSubmit}>
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
            ></Form.Control>
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
