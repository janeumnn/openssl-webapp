import { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';

import './TabDigest.css';

const ALGORITHMS = ['md5', 'sha256', 'sha512'];

function TabDigest({ runCommand }) {
  const { state, dispatch } = useStore();
  const [validation, setValidation] = useState({
    fileInput: false,
  });
  const [dgst, setDgst] = useState({
    algorithm: ALGORITHMS[0],
    file: '',
  });

  useEffect(() => {
    setDgst((prev) => ({ ...prev, file: '' }));
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
    switch (key) {
      case 'file':
        setDgst((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileInput: false }));
        break;
      default:
        setDgst((prev) => ({ ...prev, [key]: value }));
        break;
    }
  };

  const checkValidation = () => {
    let valid = true;
    if (!dgst.file) {
      setValidation((prev) => ({ ...prev, fileInput: true }));
      valid = false;
    }
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (checkValidation()) {
      const command = commandBuilder();
      dispatch({ type: 'SET_COMMAND', command: command });
      runCommand(command);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
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
              as="select"
              value={dgst.file ? dgst.file : '1'}
              onChange={set('file')}
              isInvalid={validation.fileInput}
              custom
            >
              <option value="1" disabled hidden>
                Select...
              </option>
              {state.fileNames.map((file) => (
                <option key={file}>{file}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">No file selected</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <Button type="submit" disabled={state.isLoading}>
        Execute
      </Button>
    </Form>
  );
}

export default TabDigest;
