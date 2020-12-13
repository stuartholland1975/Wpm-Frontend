import React from "react";
import { Card, CardDeck, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllAreas } from "../../services/data/areaData";
import { fetchAreas } from "../../services/thunks";
import Color from "color";

const formatNumber = (value) =>
  Math.floor(value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const WorkloadSummary = () => {
  const dispatch = useDispatch();
  const orderValues = useSelector(selectAllAreas).sort(function (a, b) {
    return a["id"] - b["id"];
  });

  useEffectOnce(() => {
    dispatch(fetchAreas());
  });
  return (
    <div>
      <h3 style={{ textAlign: "center" }}>CONTRACT WORKLOAD</h3>
      <hr />
      <CardDeck>
        <Card style={{ backgroundColor: "hsl(180, 20%, 75%)" }}>
          <Card.Body>
            <Card.Title style={{ fontWeight: "bold", textAlign: "center" }}>
              All Areas
            </Card.Title>
            <hr />
            <Card.Text>
              <Row className="mb-2">
                <Col>Order Book:</Col>
                <Col
                  style={{
                    textAlign: "right",
                  }}
                >
                  {formatNumber(
                    orderValues
                      .map((item) => item.order_value)
                      .reduce((acc, item) => acc + item, 0)
                  )}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>Work Done:</Col>
                <Col
                  style={{
                    textAlign: "right",
                  }}
                >
                  {formatNumber(
                    orderValues
                      .map((item) => item["complete_value"])
                      .reduce((acc, item) => acc + item, 0)
                  )}
                </Col>
              </Row>

              <Row className="mb-2">
                <Col>Applied Value:</Col>
                <Col
                  style={{
                    textAlign: "right",
                  }}
                >
                  {formatNumber(
                    orderValues
                      .map((item) => item["applied_value"])
                      .reduce((acc, item) => acc + item, 0)
                  )}
                </Col>
              </Row>
              <Row>
                <Col>To Apply For:</Col>
                <Col
                  style={{
                    textAlign: "right",
                  }}
                >
                  {formatNumber(
                    orderValues
                      .map(
                        (item) => item["complete_value"] - item["applied_value"]
                      )
                      .reduce((acc, item) => acc + item, 0)
                  )}
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col style={{ fontWeight: "bold" }}>Work To Do:</Col>
              <Col
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {formatNumber(
                  orderValues
                    .map((item) => item.order_value - item["complete_value"])
                    .reduce((acc, item) => acc + item, 0)
                )}
              </Col>
            </Row>
          </Card.Footer>
        </Card>
        {orderValues.map((item) => {
          const {
            order_value,
            applied_value,
            complete_value,
            area_description,
            id,
          } = item;
          return (
            <Card style={{ backgroundColor: "hsl(180, 20%, 75%)" }} key={id}>
              <Card.Body>
                <Card.Title
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                >
                  {area_description}
                </Card.Title>
                <hr />
                <Card.Text>
                  <Row className="mb-2">
                    <Col>Order Book:</Col>
                    <Col style={{ textAlign: "right" }}>
                      {formatNumber(order_value)}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>Work Done:</Col>
                    <Col style={{ textAlign: "right" }}>
                      {formatNumber(complete_value)}
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col>Applied Value:</Col>
                    <Col style={{ textAlign: "right" }}>
                      {formatNumber(applied_value)}
                    </Col>
                  </Row>
                  <Row>
                    <Col>To Apply For:</Col>
                    <Col style={{ textAlign: "right" }}>
                      {formatNumber(complete_value - applied_value)}
                    </Col>
                  </Row>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col style={{ fontWeight: "bold" }}>Work To Do:</Col>
                  <Col
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {formatNumber(order_value - complete_value)}
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          );
        })}
      </CardDeck>
    </div>
  );
};

export default WorkloadSummary;
