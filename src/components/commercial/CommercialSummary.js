import React from "react";
import AppliedValueByApplication from "./AppliedValueByApplication";
import ValueCompleteByWeek from "./ValueCompleteByWeek";
import ValueCompleteByWorkInstruction from "./ValueCompleteByWorkInstruction";
import { CardDeck, Card, Container } from "react-bootstrap";

const CommercialSummary = () => {
  return (
    <Container fluid>
      <h3 style={{textAlign: "center"}}>COMMERCIAL SUMMARY</h3>
      <hr/>
      <CardDeck>
        <Card>
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Value By Application
            </Card.Title>

            <AppliedValueByApplication />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Value Complete By Week Number
            </Card.Title>

            <ValueCompleteByWeek />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Value Complete By Work Instruction
            </Card.Title>

            <ValueCompleteByWorkInstruction />
          </Card.Body>
        </Card>
      </CardDeck>
    </Container>
  );
};

export default CommercialSummary;
