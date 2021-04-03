import { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';
import { buildDgst } from '../../../../core/commandBuilder';

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
    setDgst((prev) => {
      const hasFile = state.files.find((item) => item.file.name === prev.file);

      return {
        ...prev,
        file: hasFile ? prev.file : '',
      };
    });
  }, [state.files]);

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

  const execute = () => {
    if (checkValidation()) {
      const command = buildDgst(dgst);
      dispatch({ type: 'SET_COMMAND', command: command });
      runCommand(command, 'dgst');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} md={5} controlId="dgst-algorithm">
          <Form.Label className="mb-2">Hash function</Form.Label>
          <Form.Control as="select" value={dgst.algorithm} onChange={set('algorithm')} custom>
            {ALGORITHMS.map((algorithm) => (
              <option key={algorithm}>{algorithm}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} md={5} controlId="dgst-file-in">
          <Form.Label className="mb-2">File</Form.Label>
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
            {state.files.map((item) => (
              <option key={item.file.name}>{item.file.name}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">No file selected</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Button type="button" onClick={execute} disabled={state.isLoading}>
        Execute
      </Button>
    </Form>
  );
}

export default TabDigest;
