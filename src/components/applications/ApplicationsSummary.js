import React, {Fragment} from "react";
import {useEffectOnce} from "react-use";
import {fetchApplications} from "../../services/thunks"
import {useDispatch, useSelector} from "react-redux";
import CommercialCard from "../ui-components/CommercialCard";
import {selectAllApplications} from "./ApplicationData";
import moment from "moment";
import {Container} from "react-bootstrap";



function formatDate(date) {
    return moment(date).format("DD/MM/YYYY")
}

const numFormat = (num) => {
    return (
        num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    )
};

const ApplicationsSummary = () => {

const dispatch = useDispatch()
const applications = useSelector(selectAllApplications)
    useEffectOnce(() => {
        dispatch(fetchApplications())
    })
    return(
        <Container fluid>
            <div>
                <hr/>
            <h4 style={{display: "flex"} }>APPLICATIONS:</h4>
            <hr/>
            <div className='row' style={{display: "flex"}}>
            {applications.map(item => {
                        const {app_date, app_current, id, app_ref, application_value} = item;

                        return (
                            <div className="col" key={id}>
                                <CommercialCard
                                    title={app_ref}
                                    textLabelTop="Date:"
                                    textValueTop={formatDate(app_date)}
                                    textLabelMid="VALUE:"
                                    textValueMid={numFormat(application_value)}
                                    textLabelBtm="STATUS:"
                                    textValueBtm={app_current ? "OPEN" : "CLOSED"}
                                    footer={<a href="#" onClick={(e) => console.log(e, item)}>View
                                        Application</a>}
                                    titleStyle={app_current ? {color: "navy", textAlign: "center"} : {
                                        color: "",
                                        textAlign: "center"
                                    }}
                                />
                            </div>
                        )
                        
                    })}
                    </div>
                    </div>
        </Container>
    )
}

export default ApplicationsSummary;
