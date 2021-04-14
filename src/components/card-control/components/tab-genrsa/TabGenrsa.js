import { useState, useEffect, useRef } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';
import { buildGenrsa, buildRsa } from '../../../../core/commandBuilder';

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

  const [rsa, setRsa] = useState({
    pubin: false,
    in: '',
    pubout: false,
    out: false,
    outFile: '',
  });

  const isPrivateKey = useRef(false);
  const isPublicKey = useRef(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    const hasPrivateKey = state.files?.find((item) => item.file.name === genrsa.outFile);
    const hasPublicKey = state.files?.find((item) => item.file.name === rsa.outFile);

    if (isPrivateKey.current) {
      setPrivateKey(hasPrivateKey.file.name);
      isPrivateKey.current = false;
    } else if (!hasPrivateKey) {
      setPrivateKey(null);
    }

    if (isPublicKey.current) {
      setPublicKey(hasPublicKey.file.name);
      isPublicKey.current = false;
    } else if (!hasPublicKey) {
      setPublicKey(null);
    }
  }, [state.files]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    switch (key) {
      case 'outFile':
        setGenrsa((prev) => ({ ...prev, [key]: value.replace(/\s/g, '') }));
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
    const rsaArguments = {
      pubin: false,
      in: privateKey,
      pubout: true,
      out: true,
      outFile: privateKey.replace(/\.([^.]*)$/, '').concat('.pub'),
    };
    const command = buildRsa(rsaArguments);

    isPublicKey.current = true;
    setRsa(rsaArguments);
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command, 'rsa');
  };

  const showPrivateKey = () => {
    const rsaArguments = {
      pubin: false,
      in: privateKey,
      pubout: false,
      out: false,
      outFile: '',
    };
    const command = buildRsa(rsaArguments);

    setRsa(rsaArguments);
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command, 'rsa');
  };

  const showPublicKey = () => {
    const rsaArguments = {
      pubin: true,
      in: publicKey,
      pubout: false,
      out: false,
      outFile: '',
    };
    const command = buildRsa(rsaArguments);

    setRsa(rsaArguments);
    dispatch({ type: 'SET_COMMAND', command: command });
    runCommand(command, 'rsa');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} md={5} controlId="genrsa-file-name">
          <Form.Label className="mb-2">Output file</Form.Label>
          <Form.Control
            as="input"
            placeholder="Filename..."
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
      <Form.Row>
        <Form.Group className="mb-md-0" as={Col} lg={'auto'} md={'auto'}>
          <Button type="button" onClick={execute} disabled={state.isLoading}>
            Execute
          </Button>
        </Form.Group>
        {privateKey && (
          <>
            <Form.Group className="mb-md-0" as={Col} lg={'auto'} md={'auto'}>
              <Button
                title={privateKey}
                variant="outline-secondary"
                onClick={showPrivateKey}
                style={{ width: '170px' }}
              >
                Show private key
              </Button>
            </Form.Group>
            {!publicKey ? (
              <Form.Group className="mb-md-0" as={Col} lg={'auto'} md={'auto'}>
                <Button
                  variant="outline-secondary"
                  onClick={generatePublicKey}
                  style={{ width: '170px' }}
                >
                  Generate public key
                </Button>
              </Form.Group>
            ) : (
              <Form.Group className="mb-md-0" as={Col} lg={'auto'} md={'auto'}>
                <Button
                  title={publicKey}
                  variant="outline-secondary"
                  onClick={showPublicKey}
                  style={{ width: '170px' }}
                >
                  Show public key
                </Button>
              </Form.Group>
            )}
          </>
        )}
      </Form.Row>
    </Form>
  );
}

export default TabGenrsa;
