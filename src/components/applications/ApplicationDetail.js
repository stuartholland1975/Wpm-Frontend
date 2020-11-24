import React from "react";
import Container from "react-bootstrap/Container";
import { CSVDownload } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "react-use";
import {
  exportApplicationDetails,
  resetApplicationDetails,
} from "../../services/data/ApplicationDetailsData";
import { selectAllApplications } from "../../services/data/ApplicationData";
import { setSelectedInstruction } from "../../services/data/gridData";
import { fetchAppDetails } from "../../services/thunks";
import ApplicationBillItems from "./ApplicationBillItems";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import ApplicationLocations from "./ApplicationLocations";
import {selectedlocation} from "../../services/selectors";

const numFormat = (num) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ApplicationDetail = (props) => {
  const appItems = useSelector((state) => state.applicationDetail.items);
  const applications = useSelector(selectAllApplications);
 // const selectedlocation = useSelector(selectedlocation);
  const { appId } = useParams();
  const exportDataFlag = useSelector(
    (state) => state.applicationDetail.exportData
  );
  const { orders, locations, items, images } = useSelector(
    (state) => state.applicationDetail
  );
  const appValue = numFormat(
    applications
      .filter((obj) => obj.app_number == appId).map(item => item.application_value)
     .reduce((acc, item) => acc + item, 0)
  );
  const dispatch = useDispatch();
  const params = useParams();

  useEffectOnce(() => {
    dispatch(fetchAppDetails(params.appId));
    //dispatch(setSelectedInstruction(false));
    return () => {
      dispatch(resetApplicationDetails());
      //	dispatch(exportApplicationDetails(false))
    };
  });

  return (
    <Container fluid>
      <div style={{display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
      <h3 style={{fontWeight: "bolder" }}>APPLICATION NUMBER &nbsp;&nbsp;{params.appId }</h3>
      <h3 style={{fontWeight: "bolder"}}>APPLICATION VALUE   &nbsp;&nbsp;    {appValue} </h3>
      </div>
      
      <ApplicationInstructionList data={orders} />
      <ApplicationLocations />
      <ApplicationBillItems />
      {exportDataFlag && <CSVDownload data={appItems} />}
    </Container>
  );
};

export default ApplicationDetail;
