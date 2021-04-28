import { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
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
  'aria-256-cbc',
  'aria-192-cbc',
  'aria-128-cbc',
  'camellia-256-cbc',
  'camellia-192-cbc',
  'camellia-128-cbc',
  'des3',
  'sm4',
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
    in: false,
    inFile: '',
    out: false,
    outFile: '',
    k: true,
    kVal: 'my_passphrase',
    kfile: false,
    kValFile: '',
    pbkdf2: true,
    iv: false,
    ivVal: '',
    a: false,
    text: true,
    textVal: 'Lorem ipsum dolor sit amet',
  });

  useEffect(() => {
    setEnc((prev) => {
      const hasInFile = state.files.find((item) => item.file.name === prev.inFile);
      const hasKValFile = state.files.find((item) => item.file.name === prev.kValFile);

      return {
        ...prev,
        inFile: hasInFile ? prev.inFile : '',
        kValFile: hasKValFile ? prev.kValFile : '',
      };
    });
  }, [state.files]);

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
      case 'in':
        setEnc((prev) => ({ ...prev, [key]: value, text: !value }));
        setValidation((prev) => ({
          ...prev,
          textInput: false,
          fileInput: false,
          fileOutput: false,
        }));
        break;
      case 'inFile':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileInput: false }));
        break;
      case 'out':
        setEnc((prev) => ({ ...prev, [key]: value }));
        setValidation((prev) => ({ ...prev, fileOutput: false }));
        break;
      case 'outFile':
        setEnc((prev) => ({ ...prev, [key]: value.replace(/\s/g, '') }));
        setValidation((prev) => ({ ...prev, fileOutput: false }));
        break;
      case 'k':
        setEnc((prev) => ({ ...prev, [key]: value, kfile: !value, kValFile: '' }));
        setValidation((prev) => ({ ...prev, passphrase: false }));
        break;
      case 'kVal':
        setEnc((prev) => ({ ...prev, [key]: value.replace(/\s/g, '') }));
        setValidation((prev) => ({ ...prev, passphrase: false }));
        break;
      case 'kfile':
        setEnc((prev) => ({ ...prev, [key]: value, k: !value }));
        setValidation((prev) => ({ ...prev, passphrase: false }));
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
        setEnc((prev) => ({ ...prev, [key]: value.replace(/\s/g, '') }));
        setValidation((prev) => ({ ...prev, initVector: false }));
        break;
      case 'text':
        setEnc((prev) => ({ ...prev, [key]: value, in: !value }));
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
      case 'pbkdf2':
        setEnc((prev) => ({ ...prev, [key]: !enc.pbkdf2 }));
        break;
      default:
        setEnc((prev) => ({ ...prev, [key]: value }));
        break;
    }
  };

  const checkValidation = () => {
    let valid = true;
    if (enc.in && !enc.inFile) {
      setValidation((prev) => ({ ...prev, fileInput: true }));
      valid = false;
    }
    if (enc.out && !enc.outFile) {
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
        <Col xs={8} sm={10} md={7} lg={5} xl={4}>
          <Row>
            <Form.Label as={Col} xs={12} sm={3} className="mb-3">
              Mode:
            </Form.Label>
            <Form.Group as={Col} xs={6} sm={4} md={4} lg={4} xl={4}>
              <Form.Check
                id="enc-encrypt"
                type="radio"
                label="Encrypt"
                className="text-nowrap"
                checked={enc.e}
                onChange={set('e')}
                inline
                custom
              />
            </Form.Group>
            <Form.Group as={Col} xs={6} sm={3}>
              <Form.Check
                id="enc-decrypt"
                type="radio"
                label="Decrypt"
                className="text-nowrap"
                checked={!enc.e}
                onChange={set('d')}
                inline
                custom
              />
            </Form.Group>
          </Row>
        </Col>
      </Form.Row>
      <hr className="mt-0 mb-3" />
      <Form.Row>
        <Col xs={8} sm={10} md={7} lg={5} xl={4}>
          <Row>
            <Form.Label as={Col} xs={12} sm={3} className="mb-3">
              Input:
            </Form.Label>

            <Form.Group as={Col} xs={6} sm={4} md={4} lg={4} xl={4}>
              <Form.Check
                id="enc-text"
                type="radio"
                label="Text"
                className="text-nowrap"
                checked={enc.text}
                onChange={set('text')}
                inline
                custom
              />
            </Form.Group>
            <Form.Group as={Col} xs={6} sm={3}>
              <Form.Check
                id="enc-file-in"
                type="radio"
                label="File"
                className="text-nowrap"
                checked={!enc.text}
                onChange={set('in')}
                inline
                custom
              />
            </Form.Group>
          </Row>
        </Col>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={10}>
          {enc.text ? (
            <>
              <Form.Control
                id="enc-text-in"
                as="textarea"
                placeholder="Enter text to encrypt/decrypt..."
                value={enc.textVal}
                rows={2}
                onChange={set('textVal')}
                isInvalid={validation.textInput}
              />
              <Form.Control.Feedback type="invalid">No text input</Form.Control.Feedback>
            </>
          ) : (
            <>
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
            </>
          )}
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={5} controlId="enc-cipher">
          <Form.Label className="mb-2">Cipher</Form.Label>
          <Form.Control as="select" value={enc.cipher} onChange={set('cipher')} custom>
            {CIPHERS.map((cipher) => (
              <option key={cipher}>{cipher}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} md={5}>
          <Form.Check
            id="enc-file-out"
            type="checkbox"
            className="mb-2"
            label="Output file"
            checked={enc.out}
            onChange={set('out')}
            custom
          />
          <InputGroup>
            <Form.Control
              id="enc-file-out-name"
              as="input"
              placeholder="Filename..."
              value={enc.outFile}
              onChange={set('outFile')}
              isInvalid={validation.fileOutput}
              disabled={!enc.out}
            />
            <InputGroup.Append>
              <ButtonGroup toggle>
                <ToggleButton
                  type="checkbox"
                  variant="secondary"
                  value="1"
                  checked={enc.a}
                  onChange={set('a')}
                  disabled={!enc.out}
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
        <Col md={5} lg={5}>
          <Form.Row>
            <Form.Group as={Col} xs={'auto'} className="mr-auto mb-0">
              <Form.Label>Key derivation function:</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={'auto'}>
              <Form.Check
                id="enc-kdf-default"
                type="radio"
                label="Default"
                className="text-nowrap mr-5"
                checked={!enc.pbkdf2}
                onChange={set('pbkdf2')}
                inline
                custom
              />

              <Form.Check
                id="enc-pbkdf"
                type="radio"
                label="PBKDF2"
                className="text-nowrap mr-0"
                checked={enc.pbkdf2}
                onChange={set('pbkdf2')}
                inline
                custom
              />
            </Form.Group>
          </Form.Row>
        </Col>
      </Form.Row>
      <Button type="button" onClick={execute} disabled={state.isLoading}>
        Execute
      </Button>
    </Form>
  );
}

export default TabEncryption;
