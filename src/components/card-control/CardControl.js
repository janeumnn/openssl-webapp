import { Card, Nav, Tab } from 'react-bootstrap';
import TabGenrsa from './components/tab-genrsa/TabGenrsa';
import TabEncryption from './components/tab-encryption/TabEncryption';
import TabDigest from './components/tab-digest/TabDigest';
import TabFiles from './components/tab-files/TabFiles';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../contexts/store';
import './CardControl.css';

function CardControl({ runCommand }) {
  const { state } = useStore();
  const [newFileAdded, setNewFileAdded] = useState(false);
  const lastIndex = useRef(0);

  useEffect(() => {
    const lastItem = state.files[state.files.length - 1];
    if (lastItem?.output && state.files.length >= lastIndex.current) {
      setNewFileAdded(true);
    }
    lastIndex.current = state.files.length;
  }, [state.files]);

  const resetCount = (key) => {
    if (key === 'files') setNewFileAdded(false);
  };

  return (
    <Tab.Container defaultActiveKey="encryption" onSelect={(k) => resetCount(k)}>
      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="encryption">Encryption</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="genrsa">RSA</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="digest">Digest</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="files">Files{newFileAdded && '*'}</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="encryption">
              <TabEncryption runCommand={runCommand}></TabEncryption>
            </Tab.Pane>
            <Tab.Pane eventKey="genrsa">
              <TabGenrsa runCommand={runCommand}></TabGenrsa>
            </Tab.Pane>
            <Tab.Pane eventKey="digest">
              <TabDigest runCommand={runCommand}></TabDigest>
            </Tab.Pane>
            <Tab.Pane eventKey="files">
              <TabFiles></TabFiles>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
}

export default CardControl;
