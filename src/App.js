import React from 'react';
import {Route, Switch} from 'react-router-dom';
import ImportInstructionData from "./components/import-data/ImportInstructionData";
import InstructionList from './components/work-instructions/InstructionList';
import ActivityList from './components/activities/ActivityList';
import Home from './components/home/Home';
import Test from './components/test/Test';
import Workload from "./components/workload/Workload";
import Login from './services/login';
import NavDrawer from './components/navigation/NavDrawer';
import {makeStyles} from '@material-ui/core/styles';
import WpmModal from './components/ui-components/InstructionModal';
import LocationList from './components/locations/LocationList';
import InstructionDetail from './components/work-instructions/InstructionDetail';
import WorkProgressTable from "./components/worksheets/WorkProgressTable";
import ApplicationsSummary from "./components/applications/ApplicationsSummary";
import ApplicationDetail from "./components/applications/ApplicationDetail"
import Dashboard from "./components/dashboard/Dashboard";
import CommercialSummary from "./components/commercial/CommercialSummary";
import { WorksheetPrints } from "./components/worksheets/WorksheetPrints";

const useStyles = makeStyles({
    container: {
        display: 'flex',
    },
    content: {
        display: 'flex',
        margin: 10,
        width: '100%',
    },
});

const App = (props) => {
    const classes = useStyles();
    return (
      <div className={classes.container}>
        <NavDrawer />
        <WpmModal />
        <div className={classes.content}>
          <Switch>
            <Route exact from="/home" render={(props) => <Home {...props} />} />
            <Route
              path="/work-instructions"
              exact
              component={InstructionList}
            />
            <Route path="/activities" exact component={ActivityList} />
            <Route
              path="/work-instructions/summary/worksheets"
              exact
              component={WorksheetPrints}
            />
            <Route path="/login" exact component={Login} />
            <Route
              path="/work-instructions/summary/locations/:OrderId"
              exact
              component={LocationList}
            />
            <Route
              path="/work-instructions/summary/items/:OrderId"
              exact
              component={InstructionDetail}
            />
            <Route
              path="/work-instructions/summary/worksheets/:OrderId"
              exact
              component={WorkProgressTable}
            />
            <Route
              path="/work-instructions/summary/import"
              exact
              component={ImportInstructionData}
            />
            <Route
              path="/work-instructions/workload"
              exact
              component={Workload}
            />
            <Route
              path="/commercial/applications/summary/"
              exact
              component={ApplicationsSummary}
            />
            <Route
              path="/commercial/applications/detail/:appId"
              exact
              component={ApplicationDetail}
            />
            <Route
              path="/commercial/summary/"
              exact
              component={CommercialSummary}
            />
            <Route path="/dashboard" exact component={Dashboard} />
          </Switch>
        </div>
      </div>
    );
};

export default App;
