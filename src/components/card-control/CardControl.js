import { Card, Nav, Navbar, Tab } from 'react-bootstrap';
import TabGenrsa from './components/tab-genrsa/TabGenrsa';
import TabEncryption from './components/tab-encryption/TabEncryption';
import TabDigest from './components/tab-digest/TabDigest';
import TabFiles from './components/tab-files/TabFiles';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../contexts/store';
import './CardControl.css';

function CardControl({ runCommand }) {
  const { state } = useStore();
  const [tabKey, setTabKey] = useState('');
  const [newFileAdded, setNewFileAdded] = useState(false);
  const lastIndex = useRef(0);

  useEffect(() => {
    const lastItem = state.files[state.files.length - 1];
    if (lastItem?.output && state.files.length >= lastIndex.current && tabKey !== 'files') {
      setNewFileAdded(true);
    }
    lastIndex.current = state.files.length;
  }, [state.files]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tabKey === 'files') setNewFileAdded(false);
  }, [tabKey]);

  return (
    <div className="mb-3">
      <Tab.Container defaultActiveKey="encryption" onSelect={(k) => setTabKey(k)}>
        <Card>
          <Card.Header>
            <Nav className="flex-column flex-md-row" variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="encryption">Encryption</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="genrsa">RSA-Keygen</Nav.Link>
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
    </div>
  );
}

export default CardControl;
