import React from "react";
import {
  BlueButton,
  GreenButton,
} from "../ui-components/Buttons";
import { Container } from "react-bootstrap";

const ApplicationButtons = (props) => {
  return (
    <Container fluid>
      <GreenButton
        type="button"
        onClick={props.submitApplication}
        fullWidth
        disabled={props.submissionAvailable}
      >
        SUBMIT APPLICATION
      </GreenButton>

      <BlueButton type="button" onClick={props.goBack} fullWidth>
        GO BACK
      </BlueButton>
    </Container>
  );
};

export default ApplicationButtons;
