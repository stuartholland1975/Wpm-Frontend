import {
  faCoins,
  faHardHat,
  faPoundSign,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Drawer, List, ListItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import BuildIcon from "@material-ui/icons/Build";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { useConfirm } from "material-ui-confirm";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, withRouter } from "react-router-dom";
import { show } from "redux-modal";
import { v4 as uuidv4 } from "uuid";
import { selectAllApplications } from "../../services/data/ApplicationData";
import {
  selectAllEditedRows,
  setClickedLocation,
  setSelectedBillItem,
  setSelectedInstruction,
  setSelectedLocation,
  setSelectedRow,
  resetEditedRow,
} from "../../services/data/gridData";
import { selectAllAvailableWorkInstructions } from "../../services/data/InstructionData";
import {
  updateCurrentApplication,
  closeApplication,
  deleteInstructionDetail,
  deleteLocation,
  deleteWorkInstruction,
  fetchAvailableInstructions,
  submitApplicationData,
  updateWorkInstruction,
  addBulkWorksheetToApplication,
} from "../../services/thunks";
import LetterM from "../icons/letter-m.png";
import LetterP from "../icons/letter-p.png";
import LetterW from "../icons/letter-w.png";
import { submissionAvailable } from "../../services/selectors";
import WorkInstructionButtons from "./WorkInstructionButtons";
import BillItemButtons from "./BillItemButtons";
import LocationButtons from "./LocationButtons";
import WorksheetButtons from "./WorksheetButtons";
import ApplicationButtons from "./ApplicationButtons";
import ApplicationDetailButtons from "./ApplicationDetailButtons";

const drawerWidth = 270;

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
    flexDirection: "column",
    //alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
  },
}));

function toFixed(number, decimals) {
  const x = Math.pow(10, Number(decimals) + 1);
  return (Number(number) + 1 / x).toFixed(decimals);
}

const NavDrawer = (props) => {
  const classes = useStyles();
  const { history } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const applications = useSelector(selectAllApplications);
  const applicationSubmissionDetail = useSelector(
    (state) => state.applicationDetail
  );
  const submissionButtonAvailable = useSelector(submissionAvailable);
  const selectedRow = useSelector((state) => state.gridData.selectedRow);
  const editedRows = useSelector(selectAllEditedRows);
  const selectedLocation = useSelector(
    (state) => state.gridData.selectedLocation
  );
  const selectedBillItem = useSelector(
    (state) => state.gridData.selectedBillItem
  );
  const workInstructions = useSelector(selectAllAvailableWorkInstructions);

  const confirm = useConfirm();

  const updateAppliedWorksheet = () => {
    if (editedRows.length > 0) {
      const currentApp = applications.filter((obj) => obj.app_current === true);
      const currentWorkInstruction = workInstructions.filter(
        (obj) => obj.work_instruction === editedRows[0]["order_ref"]
      );
      const applied_value = editedRows
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0);

      console.log(currentApp[0].app_value + applied_value);

      const worksheetContainer = [];

      editedRows.forEach((item) => {
        worksheetContainer.push({
          ...item,
          application_number: currentApp[0].app_number,
          applied: true,
        });
      });
      dispatch(addBulkWorksheetToApplication(worksheetContainer));
      dispatch(
        updateWorkInstruction({
          id: currentWorkInstruction[0].id,
          value_applied: toFixed(
            currentWorkInstruction[0].value_applied + applied_value,
            2
          ),
        })
      )
        .then(() =>
          dispatch(
            updateCurrentApplication({
              id: currentApp[0].id,
              app_value: toFixed(currentApp[0].app_value + applied_value, 2),
            })
          )
        )
        .then(() => dispatch(resetEditedRow()))
        .then(() => dispatch(fetchAvailableInstructions()));
      //   .then(() => dispatch(fetchCurrentApplication()));
      dispatch(setSelectedInstruction(false));
    } else {
      confirm({
        title: "NO WORKSHEET SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then((r) => console.log(r));
    }
  };

  const handleOpenCreate = (name, content, title) => () => {
    //	dispatch(resetGridRow());
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then(() => dispatch(setSelectedRow(false)));
    }
  };

  const handleOpenEditItem = (name, content) => () => {
    if (selectedBillItem) {
      dispatch(
        show(name, {
          title: "EDIT BILL ITEM",
          content: content,
          formType: "edit",
        })
      );
    } else {
      confirm({
        title: "NO BILL ITEM SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then(() => dispatch(setSelectedBillItem(false)));
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
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
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then(() => dispatch(setSelectedRow(false)));
    }
  };

  const handleDeleteInstructionDetail = () => {
    if (selectedBillItem) {
      confirm({
        title: `DELETE BILL ITEM ${selectedBillItem.item_number}`,
        description: "Do you Want to Save These Changes ?",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
        cancellationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
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
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then((r) => console.log(r));
    }
  };

  const handleUploadImage = (name, content, title) => {
    if (selectedLocation) {
      dispatch(show(name, { title: title, content: content }));
    } else {
      confirm({
        title: "NO LOCATION SELECTED",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then((r) => console.log(r));
    }
  };

  const handleViewOnly = (name, content, title, size) => () => {
    dispatch(show(name, { title: title, content: content, size: size }));
    dispatch(setClickedLocation(false));
  };

  const handleViewItems = () => {
    history.push({
      pathname: `/work-instructions/summary/items/${selectedRow.id}`,
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
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
      }).then(() => dispatch(setSelectedLocation(false)));
    }
  };

  const handleUploadFromTemplate = () => {
    if (selectedRow) {
      history.push({
        pathname: "/work-instructions/summary/import",
      });
    } else {
      confirm({
        title: "NO WORK INSTRUCTION SELECTED",
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then((r) => console.log(r));
    }
  };

  const closeAndCreateApplication = () => {
    confirm({
      title: "ARE YOU SURE",
      description:
        "This Will Close The Current Application and Create the Next One in the Sequence",
      confirmationButtonProps: {
        variant: "contained",
        startIcon: <CheckBoxIcon />,
      },
      cancellationButtonProps: {
        variant: "contained",
        autoFocus: true,
        startIcon: <CancelIcon />,
      },
      dialogProps: {
        TransitionComponent: Slide,
        disableBackdropClick: true,
      },
    })
      .then(() => dispatch(closeApplication()))
      .catch(() => console.log("Action Cancelled"));
  };

  const submitApplication = () => {
    const checkLocationImages = applicationSubmissionDetail.locations.filter(
      (obj) => obj.image_count === 0
    );
    confirm({
      title: "SUBMIT APPLICATION",
      description: (
        <>
          <p>
            Are You Sure You Want To Submit This Application, Further Changes
            Will Be Prevented
          </p>
          {checkLocationImages.length > 0 && (
            <h4 style={{ fontWeight: "bold", color: "red" }}>
              This Application Contains {checkLocationImages.length} Locations
              That Have No Images
            </h4>
          )}
        </>
      ),

      confirmationButtonProps: {
        variant: "contained",
        startIcon: <CheckBoxIcon />,
      },
      cancellationButtonProps: {
        variant: "contained",
        autoFocus: true,
        startIcon: <CancelIcon />,
      },
      dialogProps: {
        TransitionComponent: Slide,
        disableBackdropClick: true,
      },
    })
      .then(() => {
        dispatch(
          submitApplicationData({
            application_id: location.state,
            submission_detail: applicationSubmissionDetail,
            app_submitted: true,
          })
        );
        history.goBack();
      })

      .catch((error) => console.log(error));
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

  const atApplications = location.pathname.startsWith(
    "/commercial/applications/summary"
  );

  const atApplicationDetail = location.pathname.startsWith(
    "/commercial/applications/detail"
  );

  const atHome = location.pathname.startsWith("/home");

  const itemsList = [
    {
      id: uuidv4(),
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => history.push("/home"),
      pathname: "/home",
    },
    {
      id: uuidv4(),
      text: "DashBoard",
      icon: <DashboardIcon />,
      onClick: () => history.push("/dashboard"),
      pathname: "/dashboard",
    },
    {
      id: uuidv4(),
      text: "Work Instructions",
      icon: <FontAwesomeIcon icon={faHardHat} size="lg" />,
      onClick: () => history.push("/work-instructions"),
      pathname: "/work-instructions",
    },
    {
      id: uuidv4(),
      text: "Activities",
      icon: <BuildIcon />,
      onClick: () => history.push("/activities"),
      pathname: "/activities",
    },
    {
      id: uuidv4(),
      text: "Workload",
      icon: <FontAwesomeIcon icon={faToolbox} size="lg" />,
      onClick: () => history.push("/work-instructions/workload"),
      pathname: "/work-instructions/workload",
    },
    {
      id: uuidv4(),
      text: "Applications",
      icon: <FontAwesomeIcon icon={faPoundSign} size="lg" />,
      onClick: () => history.push("/commercial/applications/summary"),
      pathname: "/commercial/applications/summary",
    },
    {
      id: uuidv4(),
      text: "Commercial",
      icon: <FontAwesomeIcon icon={faCoins} size="lg" />,
      onClick: () => history.push("/commercial/summary"),
      pathname: "/commercial/summary",
    },
    /* {
      text: "TEST",
      icon: <ListIcon />,
      onClick: () => history.push("/test"),
      pathname: "/test",
    }, */
  ];

  const authList = [
    {
      id: uuidv4(),
      text: "LOG OUT",
      icon: <ExitToAppIcon />,
      onClick: () => history.push("/"),
    },
    {
      id: uuidv4(),
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
            const { text, icon, pathname } = item;
            return (
              // <ListItem button key={uuidv4()} onClick={onClick}>
              <ListItem
                button
                key={uuidv4()}
                component={NavLink}
                exact
                to={pathname}
                activeStyle={{
                  fontWeight: "bolder",
                  color: "navy",
                }}
              >
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          {atHome &&
            authList.map((item) => {
              const { text, icon, onClick } = item;
              return (
                <Fragment key={uuidv4()}>
                  <ListItem button onClick={onClick}>
                    {icon && <ListItemIcon>{icon}</ListItemIcon>}
                    <ListItemText primary={text} />
                  </ListItem>
                </Fragment>
              );
            })}
        </List>

        <List>
          {atWorkInstructions && (
            <WorkInstructionButtons
              createInstruction={handleOpenCreate(
                "instruction-modal",
                "instructionForm",
                "CREATE WORK INSTRUCTION"
              )}
              editInstruction={handleOpenEdit(
                "instruction-modal",
                "instructionForm"
              )}
              deleteInstruction={handleDeleteInstruction}
              viewSummary={handleViewSummary}
              uploadFromTemplate={handleUploadFromTemplate}
            />
          )}

          {atLocations && (
            <LocationButtons
              createLocation={handleOpenCreate(
                "instruction-modal",
                "locationForm",
                "CREATE LOCATION"
              )}
              editLocation={handleOpenEditLocation(
                "instruction-modal",
                "locationForm"
              )}
              deleteLocation={handleDeleteLocation}
              updateProgress={handleViewWorksheets}
              viewItems={handleViewItems}
              viewDocuments={handleViewOnly(
                "instruction-modal",
                "documentsList",
                "VIEW DOCUMENTS"
              )}
              viewImages={handleViewOnly(
                "instruction-modal",
                "locationImages",
                "LOCATION IMAGES",
                "md"
              )}
              viewImageMap={handleViewOnly(
                "instruction-modal",
                "imageMap",
                "IMAGE MAP",
                "lg"
              )}
              uploadImage={() =>
                handleUploadImage(
                  "instruction-modal",
                  "imageForm",
                  "UPLOAD NEW IMAGE"
                )
              }
              uploadDocument={handleOpenCreate(
                "instruction-modal",
                "documentForm",
                "UPLOAD NEW DOCUMENT"
              )}
            />
          )}

          {atItemDetail && (
            <BillItemButtons
              viewDocuments={handleViewOnly(
                "instruction-modal",
                "documentsList",
                "VIEW DOCUMENTS"
              )}
              viewImages={handleViewOnly(
                "instruction-modal",
                "locationImages",
                "LOCATION IMAGES",
                "md"
              )}
              viewImageMap={handleViewOnly(
                "instruction-modal",
                "imageMap",
                "IMAGE MAP",
                "lg"
              )}
              uploadDocument={handleOpenCreate(
                "instruction-modal",
                "documentForm",
                "UPLOAD NEW DOCUMENT"
              )}
              createBillItem={handleOpenCreate(
                "instruction-modal",
                "billItemForm",
                "CREATE BILL ITEM"
              )}
              editBillItem={handleOpenEditItem(
                "instruction-modal",
                "billItemForm"
              )}
              deleteBillItem={handleDeleteInstructionDetail}
              viewLocations={handleViewSummary}
            />
          )}

          {atApplicationDetail && (
            <ApplicationDetailButtons
              submissionAvailable={submissionButtonAvailable}
              goBack={history.goBack}
              submitApplication={submitApplication}
            />
          )}

          {atApplications && (
            <ApplicationButtons
              addToApplication={updateAppliedWorksheet}
              closeApplication={closeAndCreateApplication}
            />
          )}

          {atWorksheets && (
            <WorksheetButtons
              saveProgress={handleOpenCreate(
                "instruction-modal",
                "worksheetForm",
                "SAVE WORK PROGRESS"
              )}
              goBack={props.history.goBack}
            />
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default withRouter(NavDrawer);
