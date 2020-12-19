import {
  BlueButton,
  GreenButton,
  PurpleButton,
  RedButton,
} from "../ui-components/Buttons";
import { Divider } from "@react-md/divider";
import { Container } from "react-bootstrap";
import React from "react";

const WorkInstructionButtons = (props) => {
  return (
    <Container fluid>
      <GreenButton
        type="button"
        onClick={props.createInstruction}
        fullWidth
        // startIcon={<AddIcon />}
      >
        CREATE INSTRUCTION
      </GreenButton>
      <GreenButton
        type="button"
        onClick={props.editInstruction}
        fullWidth
        // startIcon={<EditIcon />}
      >
        EDIT INSTRUCTION
      </GreenButton>
      <RedButton
        type="button"
        onClick={props.deleteInstruction}
        fullWidth
        // startIcon={<DeleteIcon />}
      >
        DELETE INSTRUCTION
      </RedButton>
      <Divider />
      <PurpleButton type="button" onClick={props.viewSummary} fullWidth>
        VIEW INSTRUCTION SUMMARY
      </PurpleButton>
      <Divider />
      <BlueButton
        type="button"
        onClick={props.uploadFromTemplate}
        fullWidth
        // startIcon={<CloudUploadIcon />}
      >
        UPLOAD FROM TEMPLATE
      </BlueButton>
    </Container>
  );
};

export default WorkInstructionButtons;
