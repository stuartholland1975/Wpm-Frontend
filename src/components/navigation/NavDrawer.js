import React from "react";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { GreenButton, PurpleButton, RedButton } from "../ui-components/Buttons";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Drawer, List, ListItem } from "@material-ui/core";
import { show } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ListIcon from "@material-ui/icons/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LetterW from "../icons/letter-w.png";
import LetterM from "../icons/letter-m.png";
import LetterP from "../icons/letter-p.png";
import { useConfirm } from "material-ui-confirm";
import { setSelectedNode } from "../grid/gridData";
import { deleteWorkInstruction } from "../work-instructions/InstructionData";

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
  const selectedNode = useSelector((state) => state.gridData.selectedNode);
  const confirm = useConfirm();
  const params = useParams();

  const handleOpenCreate = (name, content) => () => {
    dispatch(
      show(name, {
        title: "CREATE WORK INSTRUCTION",
        content: content,
        formType: "create",
      })
    );
  };

  const handleOpenEdit = (name, content) => () => {
    if (selectedNode) {
      dispatch(
        show(name, {
          title: "EDIT WORK INSTRUCTION",
          content: content,
          formType: "edit",
        })
      );
    } else {
      confirm({
        title: "NO WORK INSTRUCTION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedNode(false)));
    }
  };

  const handleDeleteRow = () => {
    if (selectedNode) {
      confirm({
        title: `DELETE ORDER ${selectedNode.work_instruction}`,
        description: "Do you Want to Save These Changes ?",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
        cancellationButtonProps: {
          variant: "contained",
        },
      })
        .then(() => dispatch(deleteWorkInstruction(selectedNode.id)))
        .catch(() => dispatch(setSelectedNode(false)));
    } else {
      confirm({
        title: "NO WORK INSTRUCTION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedNode(false)));
    }
  };

  const handleViewSummary = () => {
    if (selectedNode) {
      history.push({
        pathname: `/work-instructions/locations/summary/${selectedNode.work_instruction}`,
        state: selectedNode.project_title,
      });
    } else {
      confirm({
        title: "NO WORK INSTRUCTION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      });
    }
  };

  const handleViewItems = () => {
    history.push({
      pathname: `/work-instructions/items/summary/${selectedNode.work_instruction}`,
      state: selectedNode.project_title,
    });
  };

  const atWorkInstructions = location.pathname === "/work-instructions";
  const atLocations = location.pathname.startsWith(
    "/work-instructions/locations/summary/"
  );
  const atItemDetail = location.pathname.startsWith(
    "/work-instructions/items/summary/"
  );

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

  const instructionButtonCrudList = [
    {
      component: (
        <GreenButton
          onClick={handleOpenCreate("instruction-modal", "instructionForm")}
        >
          CREATE INSTRUCTION
        </GreenButton>
      ),
    },
    {
      component: (
        <GreenButton
          onClick={handleOpenEdit("instruction-modal", "instructionForm")}
        >
          EDIT INSTRUCTION
        </GreenButton>
      ),
    },
    {
      component: (
        <RedButton onClick={handleDeleteRow}>DELETE INSTRUCTION</RedButton>
      ),
    },
  ];

  const itemDetailButtonCrudList = [
    {
      component: (
        <GreenButton
          fullWidth
          onClick={handleOpenCreate("instruction-modal", "itemForm")}
        >
          CREATE BILL ITEM
        </GreenButton>
      ),
    },
    {
      component: (
        <GreenButton
          fullWidth
          onClick={handleOpenEdit("instruction-modal", "itemForm")}
        >
          EDIT BILL ITEM
        </GreenButton>
      ),
    },
    {
      component: (
        <RedButton fullWidth onClick={handleDeleteRow}>
          DELETE BILL ITEM
        </RedButton>
      ),
    },
  ];

  const instructionsViewList = [
    {
      component: (
        <PurpleButton onClick={handleViewSummary}>
          VIEW INSTRUCTION SUMMARY
        </PurpleButton>
      ),
    },
  ];

  const itemDetailViewList = [
    {
      component: (
        <PurpleButton onClick={handleViewSummary}>VIEW LOCATIONS</PurpleButton>
      ),
    },
  ];

  const locationButtonList = [
    {
      component: (
        <GreenButton onClick={handleOpenCreate("instruction-modal")} fullWidth>
          CREATE LOCATION
        </GreenButton>
      ),
    },
    {
      component: (
        <GreenButton onClick={handleOpenEdit("instruction-modal")} fullWidth>
          EDIT LOCATION
        </GreenButton>
      ),
    },
    {
      component: (
        <RedButton onClick={handleDeleteRow} fullWidth>
          DELETE LOCATION
        </RedButton>
      ),
    },
  ];

  const locationsViewList = [
    {
      component: (
        <PurpleButton fullWidth onClick={handleViewItems}>
          VIEW ITEMS
        </PurpleButton>
      ),
    },
    {
      component: <PurpleButton fullWidth>VIEW DOCUMENTS</PurpleButton>,
    },
    {
      component: <PurpleButton fullWidth>VIEW IMAGES</PurpleButton>,
    },
  ];

  const locationsUpdateList = [
    {
      component: <GreenButton fullWidth>UPDATE WORK PROGRESS</GreenButton>,
    },
    {
      component: <GreenButton fullWidth>UPLOAD IMAGE</GreenButton>,
    },
    {
      component: <GreenButton fullWidth>UPLOAD DOCUMENT</GreenButton>,
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
              instructionButtonCrudList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>
          <List>
            {atLocations &&
              locationButtonList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>
          <List>
            {atItemDetail &&
              itemDetailButtonCrudList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>
        </div>
        <Divider />
        <div className={classes.actions}>
          <List>
            {atWorkInstructions &&
              instructionsViewList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>
          <List>
            {atItemDetail &&
              itemDetailViewList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>

          <List>
            {atLocations &&
              locationsViewList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>
        </div>
        <Divider />
        <div className={classes.actions}>
          <List>
            {atLocations &&
              locationsUpdateList.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
          </List>
        </div>
        <Divider />
      </Drawer>
    </div>
  );
};

export default withRouter(NavDrawer);
