import { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useStore } from '../../../../contexts/store';
import { buildDgst } from '../../../../core/commandBuilder';
import { useTranslation } from 'react-i18next';

import './TabDigest.css';

const ALGORITHMS = [
  'blake2s256',
  'blake2b512',
  'md5',
  'sha1',
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'sha224',
  'sha384',
  'sha256',
  'sha512',
  'sha512-224',
  'sha512-256',
  'shake128',
  'shake256',
  'sm3',
];

function TabDigest({ runCommand }) {
  const { t } = useTranslation('translation');
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
          <Form.Label className="mb-2">{t('tabDigest.hashFunction')}</Form.Label>
          <Form.Control as="select" value={dgst.algorithm} onChange={set('algorithm')} custom>
            {ALGORITHMS.map((algorithm) => (
              <option key={algorithm}>{algorithm}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} md={5} controlId="dgst-file-in">
          <Form.Label className="mb-2">{t('tabDigest.inputFile')}</Form.Label>
          <Form.Control
            as="select"
            value={dgst.file ? dgst.file : '1'}
            onChange={set('file')}
            isInvalid={validation.fileInput}
            custom
          >
            <option value="1" disabled hidden>
              {t('tabDigest.selectPlaceholder')}
            </option>
            {state.files.map((item) => (
              <option key={item.file.name}>{item.file.name}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {t('validation.noFileSelected')}
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Button type="button" onClick={execute} disabled={state.isLoading}>
        {t('general.execute')}
      </Button>
    </Form>
  );
}

export default TabDigest;
