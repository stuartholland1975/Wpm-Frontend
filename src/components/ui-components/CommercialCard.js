import React, { Fragment } from "react";
import { Card, Row, Col } from "react-bootstrap";

const CommercialCard = (props) => {
  return (
    <Fragment>
      <Card style={{ backgroundColor: "hsl(220, 30%, 75%)" }}>
        <Card.Body>
          <Card.Title style={props.titleStyle}>{props.title}</Card.Title>
          <hr />
          <Card.Text as={"div"} style={{ fontSize: "12px" }}>
		  <Row className="mb-2">
              <Col style={{ textAlign: "left"}}>{props.textLabelTop}</Col>
              <Col style={{ textAlign: "right"}}>{props.textValueTop}</Col>
            </Row>
            <Row className="mb-2">
              <Col style={{ textAlign: "left", fontWeight: "bold" }}>
                {props.textLabelMid}
              </Col>
              <Col style={{ textAlign: "right", fontWeight: "bold" }}>
                {props.textValueMid}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col style={{ textAlign: "left"}}>{props.textLabelBtm}</Col>
              <Col style={{ textAlign: "right"}}>{props.textValueBtm}</Col>
            </Row>
            <Row >
              <Col
                style={
                  props.textValueMisc === "NOT SUBMITTED"
                    ? { fontWeight: "bold",textAlign: "left"  }
                    : {textAlign: "left"}
                }
              >
                {props.textLabelMisc}
              </Col>
              <Col
                style={
                  props.textValueMisc === "NOT SUBMITTED"
                    ? { fontWeight: "bold", textAlign: "right" }
                    : {textAlign: "right"}
                }
              >
                {props.textValueMisc}
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
        <Card.Footer
          style={{ backgroundColor: "hsl(180, 20%, 90%)", fontSize: "14px" }}
        >
          {props.footer}
        </Card.Footer>
      </Card>
    </Fragment>
  );
};
export default CommercialCard;
