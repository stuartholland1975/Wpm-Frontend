import React from "react";
import { withRouter, useLocation } from "react-router-dom";
import { BlueButton } from "../ui-components/Buttons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Divider,
  ListItem,
} from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import LetterW from "../icons/letter-w.png";
import LetterM from "../icons/letter-m.png";
import LetterP from "../icons/letter-p.png";

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
}));

const NavDrawer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { history } = props;
  const location = useLocation();

  const atWorkInstructions = location.pathname ==='/work-instructions'
  console.log(atWorkInstructions, location)

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
          {itemsList.map((item, index) => {
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
          {authList.map((item, index) => {
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
        {atWorkInstructions && <BlueButton>CREATE</BlueButton>}
        </List>
      </Drawer>
    </div>
  );
};

export default withRouter(NavDrawer);
