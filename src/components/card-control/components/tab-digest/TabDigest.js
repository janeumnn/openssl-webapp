import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';

import './TabDigest.css';

const ALGORITHMS = ['md5', 'sha256', 'sha512'];

function TabDigest({ runCommand }) {
  const { state, dispatch } = useStore();
  const fileInput = useRef();
  const [validation, setValidation] = useState({
    fileInput: false,
    submitButton: true,
  });
  const [dgst, setDgst] = useState({
    algorithm: ALGORITHMS[0],
    file: '',
  });

  useEffect(() => {
    if (state.fileNames.length === 1) {
      setValidation({ fileInput: false, submitButton: false });
      fileInput.current.value = state.fileNames[0];
      setDgst((prev) => ({ ...prev, file: state.fileNames }));
    } else if (state.fileNames.length > 1) {
      setValidation({ fileInput: true, submitButton: true });
      fileInput.current.value = '';
    } else {
      setValidation({ fileInput: false, submitButton: true });
      fileInput.current.value = '';
    }
  }, [state.fileNames]);

  const commandBuilder = () => {
    let command = ['dgst'];
    for (const key of Object.keys(dgst)) {
      switch (key) {
        case 'algorithm':
          command.push(`-${dgst.algorithm}`);
          break;

        case 'file':
          command.push(dgst.file);
          break;

        default:
          break;
      }
    }
    return command.join(' ');
  };

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setDgst((prev) => ({ ...prev, [key]: value }));
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
            <Form.Label className="mb-2">Hash function</Form.Label>
            <Form.Control as="select" value={dgst.algorithm} onChange={set('algorithm')} custom>
              {ALGORITHMS.map((algorithm) => (
                <option key={algorithm}>{algorithm}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Check.Label className="mb-2">File</Form.Check.Label>
            <Form.Control
              ref={fileInput}
              placeholder="No file selcted..."
              isInvalid={validation.fileInput}
              disabled
            ></Form.Control>
            <Form.Control.Feedback type="invalid">Only 1 file allowed</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <Button type="submit" disabled={state.isLoading || validation.submitButton}>
        Execute
      </Button>
    </Form>
  );
}

export default TabDigest;
