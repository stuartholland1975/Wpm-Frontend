import React from "react";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { selectAllApplications } from "../../services/data/ApplicationData";
import {
  resetApplicationDetails,
  setApplicationDetailsToSubmitted,
} from "../../services/data/ApplicationDetailsData";
import { fetchAppDetails } from "../../services/thunks";
import ApplicationBillItems from "./ApplicationBillItems";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import ApplicationLocations from "./ApplicationLocations";

const numFormat = (num) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ApplicationDetail = () => {
  const applications = useSelector(selectAllApplications);

  const { appId } = useParams();

  const appValue = numFormat(
    applications
      .filter((obj) => obj.app_number == appId)
      .map((item) => item["application_value"])
      .reduce((acc, item) => acc + item, 0)
  );

  const submissionStatus = applications.filter(
    (obj) => obj.app_number == appId
  )[0].app_submitted;

  const dispatch = useDispatch();
  const params = useParams();

  useEffectOnce(() => {
    const selectedApp = applications.filter(
      (obj) => obj.app_number == appId
    )[0];
    !selectedApp.app_submitted
      ? dispatch(fetchAppDetails(params["appId"]))
      : dispatch(
          setApplicationDetailsToSubmitted(selectedApp.submission_detail)
        );
    return () => {
      dispatch(resetApplicationDetails());
    };
  });

  return (
    <Container fluid>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <h3 style={{ fontWeight: "bolder" }}>
          APPLICATION NUMBER: &nbsp;&nbsp;{params["appId"]}
        </h3>
        <h3 style={{ fontWeight: "bolder" }}>
          SUBMISSION STATUS: &nbsp;&nbsp;
          {submissionStatus ? "SUBMITTED" : "NOT SUBMITTED"}
        </h3>
        <h3 style={{ fontWeight: "bolder" }}>
          APPLICATION VALUE: &nbsp;&nbsp; {appValue}{" "}
        </h3>
      </div>

      <ApplicationInstructionList />
      <ApplicationLocations />
      <ApplicationBillItems />
      {/* { exportDataFlag && (
				<CSVDownload
					data={ appItems }
					headers={ filterColumns(appItems) }
					filename={ "test.csv" }
				/>
			) } */}
    </Container>
  );
};

export default ApplicationDetail;
