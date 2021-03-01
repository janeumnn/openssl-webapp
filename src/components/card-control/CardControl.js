import { Card, Nav, Tab } from 'react-bootstrap';
import TabGenrsa from './components/tab-genrsa/TabGenrsa';
import TabEncryption from './components/tab-encryption/TabEncryption';
import TabDigest from './components/tab-digest/TabDigest';
import './CardControl.css';

function CardControl({ runCommand }) {
  return (
    <Tab.Container defaultActiveKey="encryption">
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
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
}

export default CardControl;
