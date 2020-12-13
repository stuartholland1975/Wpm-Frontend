import React, { Fragment } from "react";
import ByDate from "./TestTableCube";
import AppliedByApplication from "./chart-js/AppliedValueByApplication";
import DrillDownExample from './chart-js/DrillDownTest'
import { CardDeck, Card } from "react-bootstrap";

const Test = (props) => {
  return (
    <Fragment>
        <DrillDownExample/>
      {/*<AppliedByApplication />
<
      <ByDate />*/}
    </Fragment>
  );
};
export default Test;
