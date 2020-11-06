import React from 'react';
import {Card, Col, Row} from 'react-bootstrap';

export default function SummaryCard(props) {
    return (

        <Card style={{backgroundColor: 'hsl(180, 20%, 75%)'}} as={'div'}>
            <Card.Body>
                <Card.Title
                    style={{fontWeight: 'bold', textAlign: 'center'}}>{props.cardTitle}
                </Card.Title>
                <hr/>
                <Card.Text as={'div'}>
                    <Row as={'div'}>
                        <Col>
                            <p>{props.labelTop}</p>
                        </Col>
                        <Col>
                            <p style={{textAlign: 'right'}}>{props.valueTop}</p>
                        </Col>
                    </Row>
                    <Row as={'div'}>
                        <Col>
                            <p>{props.labelMid}</p>
                        </Col>
                        <Col>
                            <p style={{textAlign: 'right'}}>{props.valueMid}</p>

                        </Col>
                    </Row>
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Row as={'div'}>
                    <Col>
                        <p style={{textAlign: 'left', fontWeight: "bold"}}>{props.labelBot}</p>
                    </Col>
                    <Col>
                        <p style={{textAlign: 'right', fontWeight: "bold"}}>{props.valueBot}</p>

                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}
