import { Divider, Drawer, List, ListItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { useConfirm } from "material-ui-confirm";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { show } from "redux-modal";
import { deleteWorkInstruction, deleteLocation, deleteInstructionDetail } from "../../services/thunks";
import {
  setClickedLocation, setSelectedBillItem,
  setSelectedLocation,
  setSelectedRow,
} from "../grid/gridData";
import LetterM from "../icons/letter-m.png";
import LetterP from "../icons/letter-p.png";
import LetterW from "../icons/letter-w.png";
import { BlueButton, GreenButton, PurpleButton, RedButton } from "../ui-components/Buttons";

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
  const selectedRow = useSelector((state) => state.gridData.selectedRow);
  const selectedLocation = useSelector(
    (state) => state.gridData.selectedLocation
  );
  const selectedBillItem = useSelector(
    (state) => state.gridData.selectedBillItem
  );
  const confirm = useConfirm();
  const params = useParams();

  const handleOpenCreate = (name, content, title) => () => {
    dispatch(
      show(name, {
        title: title,
        content: content,
        formType: "create",
      })
    );
  };

  const handleOpenEdit = (name, content) => () => {
    if (selectedRow) {
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
      }).then(() => dispatch(setSelectedRow(false)));
    }
  };

  const handleOpenEditLocation = (name, content) => () => {
    if (selectedLocation) {
      dispatch(
        show(name, {
          title: "EDIT LOCATION",
          content: content,
          formType: "edit",
        })
      );
    } else {
      confirm({
        title: "NO LOCATION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedLocation(false)));
    }
  };

  const handleDeleteInstruction = () => {
    if (selectedRow) {
      confirm({
        title: `DELETE ORDER ${selectedRow.work_instruction}`,
        description: "Do you Want to Save These Changes ?",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
        cancellationButtonProps: {
          variant: "contained",
        },
      })
        .then(() => dispatch(deleteWorkInstruction(selectedRow.id)))
        .catch(() => dispatch(setSelectedRow(false)));
    } else {
      confirm({
        title: "NO WORK INSTRUCTION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedRow(false)));
    }
  };

  const handleDeleteInstructionDetail = () => {
    if (selectedRow) {
      confirm({
        title: `DELETE BILL ITEM ${selectedBillItem.item_number}`,
        description: "Do you Want to Save These Changes ?",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
        cancellationButtonProps: {
          variant: "contained",
        },
      })
        .then(() => dispatch(deleteInstructionDetail(selectedBillItem.id)))
        .catch(() => dispatch(setSelectedBillItem(false)));
    } else {
      confirm({
        title: "NO BILL ITEM SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedBillItem(false)));
    }
  };

  const handleDeleteLocation = () => {
    if (selectedLocation) {
      confirm({
        title: `DELETE LOCATION ${selectedLocation.location_ref}`,
        description: "Do you Want to Save These Changes ?",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
        cancellationButtonProps: {
          variant: "contained",
        },
      })
        .then(() => dispatch(deleteLocation(selectedLocation.id)))
        .then(() => dispatch(setSelectedLocation(false)))
        .catch(() => dispatch(setSelectedLocation(false)));
    } else {
      confirm({
        title: "NO LOCATION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedLocation(false)));
    }
  };

  const handleViewSummary = () => {
    if (selectedRow) {
      history.push({
        pathname: `/work-instructions/summary/locations/${selectedRow.id}`,
        state: selectedRow.project_title,
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

  const handleViewOnly = (name, content, title) => () => {
    dispatch(show(name, { title: title, content: content }));
    dispatch(setClickedLocation(false));
  };

  const handleViewItems = () => {
    history.push({
      pathname: `/work-instructions/summary/items/${selectedRow.work_instruction}`,
      state: selectedRow.project_title,
    });
  };

  const handleViewWorksheets = () => {
    if (selectedLocation) {
      history.push({
        pathname: `/work-instructions/summary/worksheets/${selectedRow.work_instruction}`,
        state: selectedRow.project_title,
      });
    } else {
      confirm({
        title: "NO LOCATION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => dispatch(setSelectedLocation(false)));
    }
  };

  const instructionBarButtons = {
    crudButtons: [
      {
        component: (
          <GreenButton
            type="button"
            onClick={handleOpenCreate(
              "instruction-modal",
              "instructionForm",
              "CREATE WORK INSTRUCTION"
            )}
            fullWidth
          >
            CREATE INSTRUCTION
          </GreenButton>
        ),
      },
      {
        component: (
          <GreenButton
            type="button"
            fullWidth
            onClick={handleOpenEdit("instruction-modal", "instructionForm")}
          >
            EDIT INSTRUCTION
          </GreenButton>
        ),
      },
      {
        component: (
          <RedButton type="button" onClick={handleDeleteInstruction} fullWidth>
            DELETE INSTRUCTION
          </RedButton>
        ),
      },
    ],
    navButtons: [
      {
        component: (
          <PurpleButton type="button" onClick={handleViewSummary} fullWidth>
            VIEW INSTRUCTION SUMMARY
          </PurpleButton>
        ),
      },
    ],
  };

  const locationsBarButtons = {
    crudButtons: [
      {
        component: (
          <GreenButton
            type="button"
            onClick={handleOpenCreate(
              "instruction-modal",
              "locationForm",
              "CREATE LOCATION"
            )}
            fullWidth
          >
            CREATE LOCATION
          </GreenButton>
        ),
      },
      {
        component: (
          <GreenButton
            type="button"
            onClick={handleOpenEditLocation(
              "instruction-modal",
              "locationForm"
            )}
            fullWidth
          >
            EDIT LOCATION
          </GreenButton>
        ),
      },
      {
        component: (
          <GreenButton type="button" fullWidth onClick={handleViewWorksheets}>
            UPDATE WORK PROGRESS
          </GreenButton>
        ),
      },
      {
        component: (
          <RedButton type="button" onClick={handleDeleteLocation} fullWidth>
            DELETE LOCATION
          </RedButton>
        ),
      },
    ],
    navButtons: [
      {
        component: (
          <PurpleButton type="button" fullWidth onClick={handleViewItems}>
            VIEW ITEMS
          </PurpleButton>
        ),
      },
      {
        component: (
          <PurpleButton
            type="button"
            fullWidth
            onClick={handleViewOnly(
              "instruction-modal",
              "documentsList",
              "VIEW DOCUMENTS"
            )}
          >
            VIEW DOCUMENTS
          </PurpleButton>
        ),
      },
      {
        component: (
          <PurpleButton
            type="button"
            fullWidth
            onClick={handleViewOnly(
              "instruction-modal",
              "locationImages",
              "LOCATION IMAGES"
            )}
          >
            VIEW ALL IMAGES
          </PurpleButton>
        ),
      },
    ],
    actionButtons: [
      {
        component: (
          <GreenButton type="button" fullWidth>
            UPLOAD IMAGE
          </GreenButton>
        ),
      },
      {
        component: (
          <GreenButton type="button" fullWidth onClick={handleOpenCreate(
              "instruction-modal",
              "documentForm",
              "UPLOAD NEW DOCUMENT"
            )}>
            UPLOAD DOCUMENT
          </GreenButton>
        ),
      },
    ],
  };

  const itemDetailsBarButtons = {
    crudButtons: [
      {
        component: (
          <GreenButton
            type="button"
            fullWidth
            onClick={handleOpenCreate("instruction-modal", "billItemForm", "CREATE BILL ITEM")}
          >
            CREATE BILL ITEM
          </GreenButton>
        ),
      },
      {
        component: (
          <GreenButton
            type="button"
            fullWidth
            onClick={handleOpenEdit("instruction-modal", "itemForm")}
          >
            EDIT BILL ITEM
          </GreenButton>
        ),
      },
      {
        component: (
          <RedButton type="button" fullWidth onClick={handleDeleteInstructionDetail}>
            DELETE BILL ITEM
          </RedButton>
        ),
      },
    ],
    navButtons: [
      {
        component: (
          <PurpleButton fullWidth type="button" onClick={handleViewSummary}>
            VIEW LOCATIONS
          </PurpleButton>
        ),
      },
      {
        component: (
          <PurpleButton
            type="button"
            fullWidth
            onClick={handleViewOnly("instruction-modal", "documentsList")}
          >
            VIEW DOCUMENTS
          </PurpleButton>
        ),
      },
      {
        component: (
          <PurpleButton
            type="button"
            fullWidth
            onClick={handleViewOnly("instruction-modal", "locationImages")}
          >
            VIEW ALL IMAGES
          </PurpleButton>
        ),
      },
    ],
    actionButtons: [
      {
        component: (
          <GreenButton type="button" fullWidth>
            UPLOAD DOCUMENT
          </GreenButton>
        ),
      },
    ],
  };

  const worksheetBarButtons = {
    actionButtons: [
      {
        component: (
          <GreenButton
            type="button"
            fullWidth
            onClick={handleOpenCreate(
              "instruction-modal",
              "worksheetForm",
              "SAVE WORK PROGRESS"
            )}
          >
            SAVE WORK PROGRESS
          </GreenButton>
        ),
      },
      {
      component: (
          <BlueButton
            type="button"
            fullWidth
            onClick={history.goBack}
          >
            GO BACK
          </BlueButton>
        ),
      },
    ],
  };

  const atWorkInstructions = location.pathname === "/work-instructions";
  const atLocations = location.pathname.startsWith(
    "/work-instructions/summary/locations/"
  );
  const atItemDetail = location.pathname.startsWith(
    "/work-instructions/summary/items/"
  );
  const atWorksheets = location.pathname.startsWith(
    "/work-instructions/summary/worksheets/"
  );

  const atSummary = location.pathname.startsWith("/work-instructions/summary/");

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
              instructionBarButtons.crudButtons.map((item) => {
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
              locationsBarButtons.crudButtons.map((item) => {
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
              itemDetailsBarButtons.crudButtons.map((item) => {
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
              instructionBarButtons.navButtons.map((item) => {
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
              itemDetailsBarButtons.navButtons.map((item) => {
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
              locationsBarButtons.navButtons.map((item) => {
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
              locationsBarButtons.actionButtons.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
            {atItemDetail &&
              itemDetailsBarButtons.actionButtons.map((item) => {
                const { component } = item;
                return (
                  <ListItem key={component.props.children}>
                    {component}
                  </ListItem>
                );
              })}
            {atWorksheets &&
              worksheetBarButtons.actionButtons.map((item) => {
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
