import React from "react";
import { Modal } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { connectModal } from "redux-modal";
import BillItemForm from "../bill-items/BillItemForm";
import DocumentForm from "../documents/DocumentForm";
import DocumentImages from "../documents/DocumentsList";
import ApplicationImages from "../images/ApplicationImages";
import ImageForm from "../images/ImageForm";
import LocationImages from "../images/LocationImages";
import LocationForm from "../locations/LocationForm";
import InstructionForm from "../work-instructions/InstructionForm";
import WorksheetForm from "../worksheets/WorksheetForm";
import {MapContainer} from "../maps/MapContainer";


const InstructionModal = (props) => {
	const {show, handleHide, title, content, formType, size} = props;
	const history = useHistory();
	const params = useParams();

	const components = {
    instructionForm: (
      <InstructionForm handleHide={handleHide} formType={formType} />
    ),
    documentsList: <DocumentImages handleHide={handleHide} />,
    locationImages: (
      <LocationImages handleHide={handleHide} sizeClass="d-block w-100" />
    ),
    locationForm: <LocationForm handleHide={handleHide} formType={formType} />,
    worksheetForm: (
      <WorksheetForm handleHide={handleHide} formType={formType} />
    ),
    documentForm: <DocumentForm handleHide={handleHide} formType={formType} />,
    billItemForm: <BillItemForm handleHide={handleHide} formType={formType} />,
    imageForm: <ImageForm handleHide={handleHide} formType={formType} />,
    applicationImages: (
      <ApplicationImages
        handleHide={handleHide}
        formType={formType}
        sizeClass="d-block w-100"
      />
    ),
    imageMap: (
      <MapContainer handleHide={handleHide} />
    ),
  };

	return (
    <div>
      <Modal
        show={show}
        onHide={handleHide}
        backdrop={false}
        
        size={size}
        autoFocus={false}
        centered={false}
        scrollable={false}
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
export default connectModal({name: "instruction-modal"})(InstructionModal);
