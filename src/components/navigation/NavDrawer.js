import React from "react";
import { withRouter, useLocation } from "react-router-dom";
import { BlueButton, RedButton } from "../ui-components/Buttons";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  Divider,
  ListItem,
} from "@material-ui/core";
import { show } from 'redux-modal';
import { useDispatch } from 'react-redux';
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ListIcon from "@material-ui/icons/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LetterW from "../icons/letter-w.png";
import LetterM from "../icons/letter-m.png";
import LetterP from "../icons/letter-p.png";
import { editRow } from "../ui-components/componentsReducer";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: "linear-gradient(hsl(0, 0%, 60%), hsl(0, 0%, 20%))",
    color: "white",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "center",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 1),
    verticalAlign: "middle",
  },
}));

const NavDrawer = (props) => {
  const classes = useStyles();
  const { history } = props;
  const location = useLocation();
  const dispatch = useDispatch();

  const handleOpen = name => () => {
    dispatch(show(name, { title: "CREATE WORK INSTRUCTION", content: "instructionForm" }))
  };

  const atWorkInstructions = location.pathname === "/work-instructions";
  console.log(atWorkInstructions, location);

  const itemsList = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => history.push("/"),
    },
    {
      text: "Work Instructions",
      icon: <ListIcon />,
      onClick: () => history.push("/work-instructions"),
    },
    {
      text: "Activities",
      icon: <ListIcon />,
      onClick: () => history.push("/activities"),
    },
    {
      text: "TEST",
      icon: <ListIcon />,
      onClick: () => history.push("/test"),
    },
  ];

  const authList = [
    {
      text: "LOG OUT",
      icon: <ExitToAppIcon />,
      onClick: () => history.push("/"),
    },
    {
      text: "LOG IN",
      icon: <LockOpenIcon />,
      onClick: () => history.push("/login"),
    },
  ];

  const actionList = [
    {
      component: 
        <BlueButton onClick={handleOpen('instruction-modal')}>
          CREATE WORK INSTRUCTION
        </BlueButton>
    },
    {
      component: 
        <BlueButton onClick={() => dispatch(editRow(true))}>
          EDIT WORK INSTRUCTION
        </BlueButton>
    },
    {
      component: 
        <RedButton onClick={() => console.log("CLICKED")}>
          DELETE WORK INSTRUCTION
        </RedButton>
    },
  ];

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img src={LetterW} alt="W" height="40px" />
          <img src={LetterP} alt="P" height="40px" />
          <img src={LetterM} alt="M" height="40px" />
        </div>
        <Divider />
        <List>
          {itemsList.map((item) => {
            const { text, icon, onClick } = item;
            return (
              <ListItem button key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          {authList.map((item) => {
            const { text, icon, onClick } = item;
            return (
              <ListItem button key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <div className={classes.actions}>
          <List>
            {atWorkInstructions &&
              actionList.map((item) => {
                const { component } = item;
                return <ListItem key={component.props.children}>{component}</ListItem>;
              })}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default withRouter(NavDrawer);
