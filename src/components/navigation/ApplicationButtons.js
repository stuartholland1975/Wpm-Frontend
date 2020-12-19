import React from "react";
import {
  GreenButton,
} from "../ui-components/Buttons";
import { Container } from "react-bootstrap";

const ApplicationButtons = (props) => {
  return (
    <Container fluid>
      <GreenButton type="button" onClick={props.addToApplication} fullWidth>
        ADD ITEMS TO APPLICATION
      </GreenButton>

      <GreenButton type="button" onClick={props.closeApplication} fullWidth>
        CLOSE CURRENT APPLICATION
      </GreenButton>
    </Container>
  );
};

export default ApplicationButtons;
