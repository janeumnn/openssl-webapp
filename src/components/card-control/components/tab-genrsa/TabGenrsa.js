import { useState, useEffect, useRef } from 'react';
import { Button, Col, Form, InputGroup } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';
import { buildGenrsa, buildRsa } from '../../../../core/commandBuilder';
import { downloadFile } from '../../../../utils/downloadFile';

import './TabGenrsa.css';

const NUMBITS = ['1024', '2048', '4096'];
const FILENAME = 'my_rsa.pem';

function TabGenrsa({ runCommand }) {
  const { state, dispatch } = useStore();
  const [validation, setValidation] = useState({
    fileOutput: false,
  });

  const [genrsa, setGenrsa] = useState({
    outFile: FILENAME,
    numbits: NUMBITS[1],
  });

  const isPrivateKey = useRef(false);
  const isPublicKey = useRef(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    if (isPrivateKey.current) {
      setPrivateKey(state.outputFile);
      isPrivateKey.current = false;
    }
    if (isPublicKey.current) {
      setPublicKey(state.outputFile);
      isPublicKey.current = false;
    }
  }, [state.outputFile]);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    switch (key) {
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
      setPrivateKey(null);
      setPublicKey(null);
      isPrivateKey.current = true;

      const command = buildGenrsa(genrsa);
      dispatch({ type: 'SET_COMMAND', command: command });
      runCommand(command, 'genrsa');
    }
  };

  const generatePublicKey = () => {
    const rsa = {
      pubin: false,
      in: privateKey.name,
      pubout: true,
      out: true,
      outFile: privateKey.name.replace(/\.[^/.]+$/, '.').concat('pub'),
    };
    isPublicKey.current = true;
    const command = buildRsa(rsa);
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command, 'rsa', [privateKey]);
  };

  const showPrivateKey = () => {
    const rsa = {
      pubin: false,
      in: privateKey.name,
    };
    const command = buildRsa(rsa);
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command, 'rsa', [privateKey]);
  };

  const showPublicKey = () => {
    const rsa = {
      pubin: true,
      in: publicKey.name,
    };
    const command = buildRsa(rsa);
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command, 'rsa', [publicKey]);
  };

  const downloadPrivateKey = () => {
    downloadFile(privateKey, privateKey.name, null);
  };

  const downloadPublicKey = () => {
    downloadFile(publicKey, publicKey.name, null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group as={Col} md={5} controlId="genrsa-file-name">
            <Form.Label className="mb-2">Output filename</Form.Label>
            <Form.Control
              as="input"
              value={genrsa.outFile}
              onChange={set('outFile')}
              isInvalid={validation.fileOutput}
            />
            <Form.Control.Feedback type="invalid">No text input</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={5} controlId="genrsa-numbits">
            <Form.Label className="mb-2">Key length</Form.Label>
            <Form.Control as="select" value={genrsa.numbits} onChange={set('numbits')} custom>
              {NUMBITS.map((numbits) => (
                <option key={numbits} value={numbits}>{`${numbits}-bit`}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Button type="button" onClick={execute} disabled={state.isLoading}>
          Execute
        </Button>
      </Form>
      {privateKey && (
        <>
          <hr></hr>
          <Form.Row>
            <Form.Group as={Col} lg={'auto'} md={'auto'}>
              <label for="genrsa-private-key">Private key</label>
              <InputGroup>
                <Form.Control id="genrsa-private-key" value={privateKey.name} disabled />
                <InputGroup.Append>
                  <Button variant="outline-secondary" onClick={downloadPrivateKey}>
                    Download
                  </Button>
                  <Button variant="outline-secondary" onClick={showPrivateKey}>
                    Show
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
            {publicKey ? (
              <Form.Group as={Col} lg={'auto'} md={'auto'}>
                <label for="genrsa-public-key">Public key</label>
                <InputGroup>
                  <Form.Control id="genrsa-public-key" value={publicKey.name} disabled />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={downloadPublicKey}>
                      Download
                    </Button>
                    <Button variant="outline-secondary" onClick={showPublicKey}>
                      Show
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            ) : (
              <Form.Group
                as={Col}
                lg={'auto'}
                md={'auto'}
                className="d-flex flex-column justify-content-end"
              >
                <Button variant="outline-secondary" onClick={generatePublicKey}>
                  Generate Public Key
                </Button>
              </Form.Group>
            )}
          </Form.Row>
        </>
      )}
    </>
  );
}

export default TabGenrsa;
