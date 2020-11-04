import React from "react";
import { Modal } from "react-bootstrap";
import { connectModal } from "redux-modal";
import InstructionForm from "../work-instructions/InstructionForm";

const InstructionModal = (props) => {
  const { show, handleHide, title, content, formType } = props;

  const components = {
    instructionForm: <InstructionForm handleHide={handleHide} formType={formType} />,
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleHide}
        backdrop={true}
        size="lg"
        autoFocus={false}
        centered={true}
        scrollable={true}
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "hsl(180, 30%, 30%)", color: "white" }}
        >
          <Modal.Title style={{ textAlign: "center" }}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{components[content]}</Modal.Body>
      </Modal>
    </div>
  );
};
export default connectModal({ name: "instruction-modal" })(InstructionModal);
