import { useRef, useState } from 'react';
import { useStore } from '../../../../contexts/store';
import {
  Badge,
  Button,
  Col,
  Collapse,
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
        <Button
          variant="outline-secondary"
          onClick={() => downloadFile(file.current, file.current.name, null)}
        >
          Download
        </Button>
        <Button variant="outline-secondary" onClick={() => showConfirmation(file.current)}>
          <i className="fas fa-trash"></i>
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
  const [openFiles, setOpenFiles] = useState(true);
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
          <label>Files</label>
          <InputGroup>
            <InputGroup.Prepend>
              <Button variant="secondary" onClick={() => setOpenFiles(!openFiles)}>
                <i
                  className="fas fa-chevron-down"
                  style={{
                    transform: openFiles ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'all 0.2s linear',
                  }}
                ></i>
              </Button>
            </InputGroup.Prepend>
            <FormFile custom>
              <FormFile.Input onChange={handleFileInputChange} multiple />
              <FormFile.Label data-browse="Browse...">
                Select files...{' '}
                <Badge pill variant="secondary">
                  {state.files.length || false}
                </Badge>
              </FormFile.Label>
            </FormFile>
          </InputGroup>
          <Collapse in={openFiles}>
            <div>
              {state.files.map((item) => (
                <File key={item.file.name} item={item} showConfirmation={handleShowModal}></File>
              ))}
            </div>
          </Collapse>
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
