import React from "react";
import { Card, Col, Row } from "react-bootstrap";

export default function SummaryCard(props) {
  return (
    <Card style={{ backgroundColor: "hsl(180, 20%, 75%)" }} as={"div"}>
      <Card.Body>
        <Card.Title style={{ fontWeight: "bold", textAlign: "center" }}>
          {props.cardTitle}
        </Card.Title>
        <hr />
        <Card.Text as={"div"}>
          <Row className="mb-2">
            <Col>{props.labelTop}</Col>
            <Col style={{ textAlign: "right" }}>{props.valueTop}</Col>
          </Row>
          <Row >
            <Col>{props.labelMid}</Col>
            <Col style={{ textAlign: "right" }}>{props.valueMid}</Col>
          </Row>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row className="mb-2">
          <Col style={{ textAlign: "left", fontWeight: "bold" }}>
            {props.labelBot}
          </Col>
          <Col style={{ textAlign: "right", fontWeight: "bold" }}>
            {props.valueBot}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
}
