import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import NavDrawer from "./components/navigation/NavDrawer";

function App() {
  return (
   <Fragment>

       <NavDrawer/>
       <Container maxWidth='xl'>
           <Switch>
             <Route />
           </Switch>
       </Container>


   </Fragment>
  );
}

export default App;
