import React from "react";
import {
  BlueButton,
  GreenButton,
} from "../ui-components/Buttons";
import { Divider } from "@react-md/divider";
import { Container } from "react-bootstrap";
import SaveIcon from "@material-ui/icons/Save";

const WorksheetButtons = (props) => {
  return (
    <Container fluid>
      <GreenButton
        type="button"
        onClick={props.saveProgress}
        fullWidth
        startIcon={<SaveIcon />}
      >
        SAVE WORK PROGRESS
      </GreenButton>

      <Divider />
      <BlueButton type="button" onClick={props.goBack} fullWidth>
        GO BACK
      </BlueButton>
    </Container>
  );
};

export default WorksheetButtons;
