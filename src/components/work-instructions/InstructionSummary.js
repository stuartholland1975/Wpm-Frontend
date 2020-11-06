import React, { Fragment, useState } from "react";
import SummaryCard from "../ui-components/SummaryCard";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Container, CardDeck } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { selectAllInstructionDetails } from "../work-instructions/instructionDetailData";
import {useLogger} from "react-use";

const numFormat = (num) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const InstructionSummary = (props) => {
  const orderDetail = useSelector(selectAllInstructionDetails);
  const [isLoading] = useState(false);
  const projectTitle = useLocation().state

  useLogger("InstructionSummary", props);
  
  const boqLabourValue = orderDetail
    .filter(({ item_type }) => item_type === "BOQ")
    .map((item) => item.labour_total)
    .reduce((acc, item) => acc + item, 0);
  const varnLabourValue = orderDetail
    .filter(({ item_type }) => item_type === "VARN")
    .map((item) => item.labour_total)
    .reduce((acc, item) => acc + item, 0);
  const boqMaterialsValue = orderDetail
    .filter(({ item_type }) => item_type === "BOQ")
    .map(
      ({ materials_total_incl_other_materials }) =>
        materials_total_incl_other_materials
    )
    .reduce((acc, item) => acc + item, 0);
  const varnMaterialsValue = orderDetail
    .filter(({ item_type }) => item_type === "VARN")
    .map(
      ({ materials_total_incl_other_materials }) =>
        materials_total_incl_other_materials
    )
    .reduce((acc, item) => acc + item, 0);
  const completedValue = orderDetail
    .map(({ value_complete }) => value_complete)
    .reduce((acc, item) => acc + item, 0);
  const appliedValue = orderDetail
    .map(({ value_applied }) => value_applied)
    .reduce((acc, item) => acc + item, 0);
  const totalBoqValue = boqLabourValue + boqMaterialsValue;
  const totalVarnValue = varnLabourValue + varnMaterialsValue;
  const totalLabourValue = boqLabourValue + varnLabourValue;
  const totalMaterialsValue = boqMaterialsValue + varnMaterialsValue;
  const totalPayable = totalLabourValue + totalMaterialsValue;
  const toComplete = totalPayable - completedValue;
  const toApply = completedValue - appliedValue;

  return (
    <Fragment>
      <Container fluid>
      <h3 className="grid-title">{projectTitle}</h3>
        {isLoading && (
          <Loader
            style={{ textAlign: "center" }}
            type={"ThreeDots"}
            color={"Blue"}
          />
        )}
        <h3 className="grid-title">{""}</h3>
        <CardDeck>
          <SummaryCard
            cardTitle="Original Order Value:"
            labelTop={"Labour Value:"}
            labelMid={"Materials Value:"}
            labelBot={"Total Payable:"}
            valueTop={numFormat(boqLabourValue)}
            valueMid={numFormat(boqMaterialsValue)}
            valueBot={numFormat(totalBoqValue)}
          />
          <SummaryCard
            cardTitle="Variation Values:"
            labelTop={"Labour Value:"}
            labelMid={"Materials Value:"}
            labelBot={"Total Payable:"}
            valueTop={numFormat(varnLabourValue)}
            valueMid={numFormat(varnMaterialsValue)}
            valueBot={numFormat(totalVarnValue)}
          />
          <SummaryCard
            cardTitle="Current Order Values:"
            labelTop={"Labour Value:"}
            labelMid={"Materials Value:"}
            labelBot={"Total Payable:"}
            valueTop={numFormat(totalLabourValue)}
            valueMid={numFormat(totalMaterialsValue)}
            valueBot={numFormat(totalPayable)}
          />
          <SummaryCard
            cardTitle="Construction Progress Values:"
            labelTop={"Current Value:"}
            labelBot={"Value Complete:"}
            labelMid={"To Complete:"}
            valueTop={numFormat(totalPayable)}
            valueBot={numFormat(completedValue)}
            valueMid={numFormat(toComplete)}
          />
          <SummaryCard
            cardTitle="Application Values:"
            labelBot={"Value Applied:"}
            labelTop={"Value Complete:"}
            labelMid={"Not Applied:"}
            valueBot={numFormat(appliedValue)}
            valueTop={numFormat(completedValue)}
            valueMid={numFormat(toApply)}
          />
        </CardDeck>
        <hr />
      </Container>
    </Fragment>
  );
};

export default InstructionSummary;
