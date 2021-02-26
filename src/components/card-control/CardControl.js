import { Card, Nav, Tab } from 'react-bootstrap';
import TabGenrsa from './components/tab-genrsa/TabGenrsa';
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
              <Nav.Link eventKey="hashing">Hashing</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="encryption"></Tab.Pane>
            <Tab.Pane eventKey="genrsa">
              <TabGenrsa runCommand={runCommand}></TabGenrsa>
            </Tab.Pane>
            <Tab.Pane eventKey="hashing"></Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
}

export default CardControl;
