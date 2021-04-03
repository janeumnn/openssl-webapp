import { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';
import { buildEnc } from '../../../../core/commandBuilder';

import './TabEncryption.css';

const CIPHERS = [
  'aes-256-cbc',
  'aes-192-cbc',
  'aes-128-cbc',
  'camellia-256-cbc',
  'camellia-192-cbc',
  'camellia-128-cbc',
  'des3',
];

function TabEncryption({ runCommand }) {
  const { state, dispatch } = useStore();
  const [validation, setValidation] = useState({
    fileInput: false,
    fileOutput: false,
    passphrase: false,
    initVector: false,
    textInput: false,
  });
  const [enc, setEnc] = useState({
    e: true,
    d: false,
    cipher: CIPHERS[0],
    inFile: '',
    outFile: '',
    k: true,
    kVal: '',
    kfile: false,
    kValFile: '',
    pbkdf2: false,
    iv: false,
    ivVal: '',
    a: false,
    text: false,
    textVal: '',
  });

  useEffect(() => {
    setEnc((prev) => ({ ...prev, inFile: '', kValFile: '' }));
  }, [state.fileNames]);

  const set = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' || event.target.type === 'radio'
        ? event.target.checked
        : event.target.value;
    switch (key) {
      case 'e':
        setEnc((prev) => ({ ...prev, [key]: value, d: !value }));
        break;
      case 'd':
        setEnc((prev) => ({ ...prev, [key]: value, e: !value }));
        break;
      case 'inFile':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileInput: false }));
        break;
      case 'outFile':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileOutput: false }));
        break;
      case 'k':
        setEnc((prev) => ({ ...prev, [key]: value, kfile: !value, kValFile: '' }));
        break;
      case 'kVal':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, passphrase: false }));
        break;
      case 'kfile':
        setEnc((prev) => ({ ...prev, [key]: value, k: !value, kVal: '' }));
        break;
      case 'kValFile':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, passphrase: false }));
        break;
      case 'iv':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, initVector: false }));
        break;
      case 'ivVal':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, initVector: false }));
        break;
      case 'text':
        setEnc((prev) => ({ ...prev, [key]: value, textVal: '' }));
        setValidation((prev) => ({
          ...prev,
          textInput: false,
          fileInput: false,
          fileOutput: false,
        }));
        break;
      case 'textVal':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, textInput: false }));
        break;
      default:
        setEnc((prev) => ({ ...prev, [key]: value }));
        break;
    }
  };

  const checkValidation = () => {
    let valid = true;
    if (!enc.text && !enc.inFile) {
      setValidation((prev) => ({ ...prev, fileInput: true }));
      valid = false;
    }
    if (!enc.text && !enc.outFile) {
      setValidation((prev) => ({ ...prev, fileOutput: true }));
      valid = false;
    }
    if (enc.k && !enc.kVal) {
      setValidation((prev) => ({ ...prev, passphrase: true }));
      valid = false;
    }
    if (enc.kfile && !enc.kValFile) {
      setValidation((prev) => ({ ...prev, passphrase: true }));
      valid = false;
    }
    if (enc.iv && !enc.ivVal) {
      setValidation((prev) => ({ ...prev, initVector: true }));
      valid = false;
    }
    if (enc.text && !enc.textVal) {
      setValidation((prev) => ({ ...prev, textInput: true }));
      valid = false;
    }
    return valid;
  };

  const execute = () => {
    if (checkValidation()) {
      const text = enc.text ? `${enc.textVal}\n` : '';
      const command = buildEnc(enc);
      dispatch({ type: 'SET_COMMAND', command: command });
      runCommand(command, 'enc', text);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Check
            id="enc-encrypt"
            type="radio"
            label="Encryption"
            checked={enc.e}
            onChange={set('e')}
            inline
            custom
          />
          <Form.Check
            id="enc-decrypt"
            type="radio"
            label="Decryption"
            checked={!enc.e}
            onChange={set('d')}
            inline
            custom
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={10}>
          <Form.Check
            id="enc-text"
            type="checkbox"
            label="Use text input"
            checked={enc.text}
            onChange={set('text')}
            custom
          />
          {enc.text && (
            <Form.Control
              id="enc-text-in"
              as="textarea"
              className="mt-2"
              placeholder="Enter text to encrypt/decrypt..."
              rows={2}
              onChange={set('textVal')}
              isInvalid={validation.textInput}
            />
          )}
          <Form.Control.Feedback type="invalid">No text input</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={3} controlId="enc-cipher">
          <Form.Label className="mb-2">Cipher</Form.Label>
          <Form.Control as="select" value={enc.cipher} onChange={set('cipher')} custom>
            {CIPHERS.map((cipher) => (
              <option key={cipher}>{cipher}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} md={3} controlId="enc-file-in">
          <Form.Label className="mb-2">File</Form.Label>
          <Form.Control
            as="select"
            value={enc.inFile ? enc.inFile : '1'}
            onChange={set('inFile')}
            isInvalid={validation.fileInput}
            disabled={enc.text}
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
        <Form.Group as={Col} md={4} controlId="enc-file-out">
          <Form.Label className="mb-2">Output filename</Form.Label>
          <InputGroup>
            <Form.Control
              as="input"
              placeholder="Filename..."
              onChange={set('outFile')}
              isInvalid={validation.fileOutput}
              disabled={enc.text}
            />
            <InputGroup.Append>
              <ButtonGroup toggle>
                <ToggleButton
                  type="checkbox"
                  variant="secondary"
                  value="1"
                  checked={enc.a}
                  onChange={set('a')}
                  disabled={enc.text}
                >
                  Base64
                </ToggleButton>
              </ButtonGroup>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">No filename specified</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={5} lg={5} controlId="enc-passphrase">
          <Form.Label className="mb-2">Passphrase</Form.Label>
          <InputGroup>
            {enc.k ? (
              <Form.Control
                as="input"
                placeholder="Input..."
                value={enc.kVal}
                onChange={set('kVal')}
                isInvalid={validation.passphrase}
              />
            ) : (
              <>
                <Form.Control
                  as="select"
                  value={enc.kValFile ? enc.kValFile : '1'}
                  onChange={set('kValFile')}
                  isInvalid={validation.passphrase}
                  custom
                >
                  <option value="1" disabled hidden>
                    Select...
                  </option>
                  {state.files.map((item) => (
                    <option key={item.file.name}>{item.file.name}</option>
                  ))}
                </Form.Control>
              </>
            )}
            <InputGroup.Append>
              <ToggleButtonGroup type="radio" name="passphrase-options" defaultValue="1">
                <ToggleButton variant="secondary" value="1" onChange={set('k')}>
                  Text
                </ToggleButton>
                <ToggleButton variant="secondary" value="2" onChange={set('kfile')}>
                  File
                </ToggleButton>
              </ToggleButtonGroup>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid">No passphrase specified</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md={5} lg={5}>
          <Form.Check
            id="enc-initvector"
            type="checkbox"
            className="mb-2"
            label="Initialization vector"
            checked={enc.iv}
            onChange={set('iv')}
            custom
          />
          <Form.Control
            id="enc-initvector-in"
            as="input"
            placeholder="Hex value..."
            value={enc.ivVal}
            onChange={set('ivVal')}
            disabled={!enc.iv}
            isInvalid={validation.initVector}
          />
          <Form.Control.Feedback type="invalid">No value specified</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={2}>
          <Form.Check
            id="enc-pbkdf"
            type="checkbox"
            label="PBKDF2"
            checked={enc.pbkdf2}
            onChange={set('pbkdf2')}
            custom
          />
        </Form.Group>
      </Form.Row>
      <Button type="button" onClick={execute} disabled={state.isLoading}>
        Execute
      </Button>
    </Form>
  );
}

export default TabEncryption;
