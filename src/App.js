import React from 'react';
import {Route, Switch} from 'react-router-dom';
import InstructionList from './components/work-instructions/InstructionList';
import ActivityList from './components/activities/ActivityList';
import Home from './components/home/Home';
import Test from './components/test/Test';
import Login from './services/login';
import NavDrawer from './components/navigation/NavDrawer';
import {makeStyles} from '@material-ui/core/styles';
import WpmModal from './components/ui-components/InstructionModal';
import LocationList from './components/locations/LocationList';
import InstructionDetail from './components/work-instructions/InstructionDetail';


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

            <NavDrawer/>
            <WpmModal/>

            <div className={classes.content}>


                <Switch>
                    <Route exact from="/" render={(props) => <Home {...props} />}/>
                    <Route path="/activities" exact component={ActivityList}/>
                    <Route path="/work-instructions" exact component={InstructionList}/>
                    <Route path="/test" exact component={Test}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/work-instructions/summary/locations/:OrderId" exact component={LocationList}/>
                    <Route path="/work-instructions/summary/items/:OrderId" exact component={InstructionDetail}/>
                </Switch>
            </div>
        </div>
    );
};

export default App;
