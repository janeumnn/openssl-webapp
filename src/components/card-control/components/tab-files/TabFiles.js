import { useRef, useState } from 'react';
import { useStore } from '../../../../contexts/store';
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  FormFile,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { downloadFile } from '../../../../utils/downloadFile';
import './TabFiles.css';

function File({ item, showConfirmation }) {
  const file = useRef(item.file);
  return (
    <InputGroup className="mt-2 mb-2">
      <Form.Control value={file.current.name} disabled></Form.Control>
      <InputGroup.Append>
        {item.output && (
          <Button
            variant="outline-secondary"
            onClick={() => downloadFile(file.current, file.current.name, null)}
          >
            Download
          </Button>
        )}
        <Button variant="outline-secondary" onClick={() => showConfirmation(file.current)}>
          <i class="fas fa-trash"></i>
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
}

function ConfirmDeletion({ show, handleCancel, handleConfirmation }) {
  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete file</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you really want to delete this file?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirmation}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function TabFiles() {
  const { state, dispatch } = useStore();
  const [showModal, setShowModal] = useState(false);

  const fileToDelete = useRef(null);

  const handleShowModal = (file) => {
    setShowModal(true);
    fileToDelete.current = file;
  };

  const handleCancelModal = () => setShowModal(false);

  const handleConfirmationModal = () => {
    setShowModal(false);
    const item = state.files.find((item) => item.file.name === fileToDelete.current.name);
    dispatch({
      type: 'DELETE_FILE',
      item: item,
    });
  };

  const handleFileInputChange = (event) => {
    const items = [...event.target.files]
      .filter((file) => !state.files.some((item) => item.file.name === file.name))
      .map((file) => {
        return { file: file, output: false };
      });

    dispatch({
      type: 'ADD_FILES',
      items: items,
    });

    event.target.value = null;
  };

  return (
    <>
      <Row>
        <Col lg={7}>
          <FormFile custom>
            <FormFile.Input onChange={handleFileInputChange} multiple />
            <FormFile.Label data-browse="Browse...">Select files...</FormFile.Label>
          </FormFile>
          <Accordion className="mt-3">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0" style={{ padding: '0.7rem' }}>
                Input files{' '}
                <span className="badge badge-secondary">
                  {state.files.filter((item) => !item.output).length || false}
                </span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  {state.files
                    .filter((item) => !item.output)
                    .map((item) => (
                      <File
                        key={item.file.name}
                        item={item}
                        showConfirmation={handleShowModal}
                      ></File>
                    ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1" style={{ padding: '0.7rem' }}>
                Output files{' '}
                <span className="badge badge-secondary">
                  {state.files.filter((item) => item.output).length || false}
                </span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  {state.files
                    .filter((item) => item.output)
                    .map((item) => (
                      <File
                        key={item.file.name}
                        item={item}
                        showConfirmation={handleShowModal}
                      ></File>
                    ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
      <ConfirmDeletion
        show={showModal}
        handleCancel={handleCancelModal}
        handleConfirmation={handleConfirmationModal}
      ></ConfirmDeletion>
    </>
  );
}

export default TabFiles;
