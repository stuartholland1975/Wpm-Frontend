import { faCoins, faHardHat, faPoundSign, faToolbox, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Drawer, List, ListItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import BuildIcon from "@material-ui/icons/Build";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DeleteIcon from "@material-ui/icons/Delete";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import SaveIcon from "@material-ui/icons/Save";
import { useConfirm } from "material-ui-confirm";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, withRouter } from "react-router-dom";
import { show } from "redux-modal";
import { v4 as uuidv4 } from "uuid";
import { selectAllApplications } from "../../services/data/ApplicationData";
import { exportApplicationDetails } from "../../services/data/ApplicationDetailsData";
import {
	selectAllEditedRows,
	setClickedLocation,
	setSelectedBillItem,
	setSelectedInstruction,
	setSelectedLocation,
	setSelectedRow,
} from "../../services/data/gridData";
import { selectAllAvailableWorkInstructions } from "../../services/data/InstructionData";
import {
	addWorksheetToApplication,
	closeApplication,
	deleteInstructionDetail,
	deleteLocation,
	deleteWorkInstruction,
	fetchCurrentApplication,
	updateWorkInstruction,
} from "../../services/thunks";
import LetterM from "../icons/letter-m.png";
import LetterP from "../icons/letter-p.png";
import LetterW from "../icons/letter-w.png";
import { BlueButton, GreenButton, PurpleButton, RedButton, } from "../ui-components/Buttons";

const drawerWidth = 280;

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
	const {history} = props;
	const location = useLocation();
	const dispatch = useDispatch();
	const applications = useSelector(selectAllApplications);
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

			editedRows.map((item) => {
				{
					dispatch(
						addWorksheetToApplication({
							...item,
							application_number: currentApp[0].app_number,
							applied: true,
						})
					);
				}
			});
			dispatch(
				updateWorkInstruction({
					id: currentWorkInstruction[0].id,
					value_applied: toFixed(
						currentWorkInstruction[0].value_applied + applied_value,
						2
					),
				})
			).then(() => dispatch(fetchCurrentApplication()));

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
		}}

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
				title: `DELETE ORDER ${ selectedRow.work_instruction }`,
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
				title: `DELETE BILL ITEM ${ selectedBillItem.item_number }`,
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
				title: `DELETE LOCATION ${ selectedLocation.location_ref }`,
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
				pathname: `/work-instructions/summary/locations/${ selectedRow.id }`,
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
			dispatch(show(name, {title: title, content: content}));
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

	const handleViewOnly = (name, content, title) => () => {
		dispatch(show(name, {title: title, content: content}));
		dispatch(setClickedLocation(false));
	};

	const handleViewItems = () => {
		history.push({
			pathname: `/work-instructions/summary/items/${ selectedRow.id }`,
			state: selectedRow.project_title,
		});
	};

	const handleViewWorksheets = () => {
		if (selectedLocation) {
			history.push({
				pathname: `/work-instructions/summary/worksheets/${ selectedRow.work_instruction }`,
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
				startIcon: <CheckBoxIcon/>,
			},
			cancellationButtonProps: {
				variant: "contained",
				autoFocus: true,
				startIcon: <CancelIcon/>,
			},
			dialogProps: {
				TransitionComponent: Slide,
				disableBackdropClick: true,
			},
		})
			.then(() => dispatch(closeApplication()))
			.catch(() => console.log("Action Cancelled"));
	};

	const instructionBarButtons = {
		crudButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						onClick={ handleOpenCreate(
							"instruction-modal",
							"instructionForm",
							"CREATE WORK INSTRUCTION"
						) }
						fullWidth
					>
						CREATE INSTRUCTION
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleOpenEdit("instruction-modal", "instructionForm") }
					>
						EDIT INSTRUCTION
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<RedButton
						id={ uuidv4() }
						type="button"
						onClick={ handleDeleteInstruction }
						fullWidth
						startIcon={ <DeleteIcon/> }
					>
						DELETE INSTRUCTION
					</RedButton>
				),
			},
		],
		navButtons: [
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						type="button"
						onClick={ handleViewSummary }
						fullWidth
					>
						VIEW INSTRUCTION SUMMARY
					</PurpleButton>
				),
			},
		],
		actionButtons: [
			{
				id: uuidv4(),
				component: (
					<BlueButton
						id={ uuidv4() }
						type="button"
						onClick={ handleUploadFromTemplate }
						fullWidth
					>
						UPLOAD FROM TEMPLATE
					</BlueButton>
				),
			},
		],
	};

	const locationsBarButtons = {
		crudButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						onClick={ handleOpenCreate(
							"instruction-modal",
							"locationForm",
							"CREATE LOCATION"
						) }
						fullWidth
					>
						CREATE LOCATION
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						onClick={ handleOpenEditLocation(
							"instruction-modal",
							"locationForm"
						) }
						fullWidth
					>
						EDIT LOCATION
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<RedButton
						id={ uuidv4() }
						type="button"
						onClick={ handleDeleteLocation }
						fullWidth
						startIcon={ <DeleteIcon/> }
					>
						DELETE LOCATION
					</RedButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleViewWorksheets }
					>
						UPDATE WORK PROGRESS
					</GreenButton>
				),
			},
		],
		navButtons: [
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleViewItems }
					>
						VIEW ITEMS
					</PurpleButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleViewOnly(
							"instruction-modal",
							"documentsList",
							"VIEW DOCUMENTS"
						) }
					>
						VIEW DOCUMENTS
					</PurpleButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleViewOnly(
							"instruction-modal",
							"locationImages",
							"LOCATION IMAGES"
						) }
					>
						VIEW ALL IMAGES
					</PurpleButton>
				),
			},
		],
		actionButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ () =>
							handleUploadImage(
								"instruction-modal",
								"imageForm",
								"UPLOAD NEW IMAGE"
							)
						}
						startIcon={ <CloudUploadIcon/> }
					>
						UPLOAD IMAGE
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleOpenCreate(
							"instruction-modal",
							"documentForm",
							"UPLOAD NEW DOCUMENT"
						) }
						startIcon={ <CloudUploadIcon/> }
					>
						UPLOAD DOCUMENT
					</GreenButton>
				),
			},
		],
	};

	const itemDetailsBarButtons = {
		crudButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleOpenCreate(
							"instruction-modal",
							"billItemForm",
							"CREATE BILL ITEM"
						) }
					>
						CREATE BILL ITEM
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleOpenEditItem("instruction-modal", "billItemForm") }
					>
						EDIT BILL ITEM
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<RedButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleDeleteInstructionDetail }
						startIcon={ <DeleteIcon/> }
					>
						DELETE BILL ITEM
					</RedButton>
				),
			},
		],
		navButtons: [
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						fullWidth
						type="button"
						onClick={ handleViewSummary }
					>
						VIEW LOCATIONS
					</PurpleButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleViewOnly("instruction-modal", "documentsList") }
					>
						VIEW DOCUMENTS
					</PurpleButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<PurpleButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleViewOnly("instruction-modal", "locationImages") }
					>
						VIEW ALL IMAGES
					</PurpleButton>
				),
			},
		],
		actionButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						startIcon={ <CloudUploadIcon/> }
					>
						UPLOAD DOCUMENT
					</GreenButton>
				),
			},
		],
	};

	const worksheetBarButtons = {
		actionButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ handleOpenCreate(
							"instruction-modal",
							"worksheetForm",
							"SAVE WORK PROGRESS"
						) }
						startIcon={ <SaveIcon/> }
					>
						SAVE WORK PROGRESS
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<BlueButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ history.goBack }
					>
						GO BACK
					</BlueButton>
				),
			},
		],
	};

	const applicationsBarButtons = {
		actionButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ updateAppliedWorksheet }
					>
						ADD ITEMS TO APPLICATION
					</GreenButton>
				),
			},
			{
				id: uuidv4(),
				component: (
					<GreenButton
						id={ uuidv4() }
						type="button"
						fullWidth
						onClick={ closeAndCreateApplication }
					>
						CLOSE CURRENT APPLICATION
					</GreenButton>
				),
			},
		],
	};

	const applicationDetailBarButtons = {
		actionButtons: [
			{
				id: uuidv4(),
				component: (
					<GreenButton
						type="button"
						fullWidth
						onClick={ () => dispatch(exportApplicationDetails(true)) }
					>
						EXPORT APP TO CSV
					</GreenButton>
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
			icon: <HomeIcon/>,
			onClick: () => history.push("/home"),
			pathname: "/home",
		},
		{
			id: uuidv4(),
			text: "DashBoard",
			icon: <DashboardIcon/>,
			onClick: () => history.push("/dashboard"),
			pathname: "/dashboard",
		},
		{
			id: uuidv4(),
			text: "Work Instructions",
			icon: <FontAwesomeIcon icon={ faHardHat } size="lg"/>,
			onClick: () => history.push("/work-instructions"),
			pathname: "/work-instructions",
		},
		{
			id: uuidv4(),
			text: "Activities",
			icon: <BuildIcon/>,
			onClick: () => history.push("/activities"),
			pathname: "/activities",
		},
		{
			id: uuidv4(),
			text: "Workload",
			icon: <FontAwesomeIcon icon={ faToolbox } size="lg"/>,
			onClick: () => history.push("/work-instructions/workload"),
			pathname: "/work-instructions/workload",
		},
		{
			id: uuidv4(),
			text: "Applications",
			icon: <FontAwesomeIcon icon={ faPoundSign } size="lg"/>,
			onClick: () => history.push("/commercial/applications/summary"),
			pathname: "/commercial/applications/summary",
		},
		{
			id: uuidv4(),
			text: "Commercial",
			icon: <FontAwesomeIcon icon={ faCoins } size="lg"/>,
			onClick: () => history.push("/commercial/applications/summary"),
			pathname: "/commercial/applications/summary",
		},
		/* {
			text: "TEST",
			icon: <ListIcon/>,
			onClick: () => history.push("/test"),
			pathname: "/test",
		}, */
	];

	const authList = [
		{
			id: uuidv4(),
			text: "LOG OUT",
			icon: <ExitToAppIcon/>,
			onClick: () => history.push("/"),
		},
		{
			id: uuidv4(),
			text: "LOG IN",
			icon: <LockOpenIcon/>,
			onClick: () => history.push("/login"),
		},
	];

	return (
		<div className={ classes.root }>
			<Drawer
				className={ classes.drawer }
				variant="permanent"
				anchor="left"
				classes={ {
					paper: classes.drawerPaper,
				} }
			>
				<div className={ classes.drawerHeader }>
					<img src={ LetterW } alt="W" height="40px"/>
					<img src={ LetterP } alt="P" height="40px"/>
					<img src={ LetterM } alt="M" height="40px"/>
				</div>
				<Divider/>
				<List>
					{ itemsList.map((item) => {
						const {text, icon, onClick, pathname, id} = item;
						return (
							// <ListItem button key={uuidv4()} onClick={onClick}>
							<ListItem
								button
								key={ uuidv4() }
								component={ NavLink }
								exact
								to={ pathname }
								activeStyle={ {
									fontWeight: "bolder",
									color: "navy",
								} }
							>
								{ icon && <ListItemIcon>{ icon }</ListItemIcon> }
								<ListItemText primary={ text }/>
							</ListItem>
						);
					}) }
				</List>
				<Divider/>
				<List>
					{ atHome &&
					authList.map((item) => {
						const {text, icon, onClick} = item;
						return (
							<Fragment key={ uuidv4() }>
								<ListItem button onClick={ onClick }>
									{ icon && <ListItemIcon>{ icon }</ListItemIcon> }
									<ListItemText primary={ text }/>
								</ListItem>
							</Fragment>
						);
					}) }
				</List>

				<List>
					{ atWorkInstructions &&
					instructionBarButtons.crudButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
					{ atLocations &&
					locationsBarButtons.crudButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
					{ atItemDetail &&
					itemDetailsBarButtons.crudButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }

					{ atWorkInstructions &&
					instructionBarButtons.navButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
					{ atItemDetail &&
					itemDetailsBarButtons.navButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
					{ atLocations &&
					locationsBarButtons.navButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
					{ atApplicationDetail &&
					applicationDetailBarButtons.actionButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ component.id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
				</List>

				<List>
					{ atLocations &&
					locationsBarButtons.actionButtons.map((item) => {
						const {component, id} = item;
						return (
							<>
								<ListItem key={ id }>{ component }</ListItem>
							</>
						);
					}) }

					{ atApplications &&
					applicationsBarButtons.actionButtons.map((item) => {
						const {component, id} = item;
						return (
							<>
								<ListItem key={ id }>{ component }</ListItem>
							</>
						);
					}) }
					{ atItemDetail &&
					itemDetailsBarButtons.actionButtons.map((item) => {
						const {component, id} = item;
						return (
							<>
								<ListItem key={ id }>{ component }</ListItem>
							</>
						);
					}) }
					{ atWorksheets &&
					worksheetBarButtons.actionButtons.map((item) => {
						const {component, id} = item;
						return (
							<>
								<ListItem key={ id }>{ component }</ListItem>
							</>
						);
					}) }
					{ atWorkInstructions &&
					instructionBarButtons.actionButtons.map((item) => {
						const {component, id} = item;
						return (
							<Fragment key={ id }>
								<ListItem>{ component }</ListItem>
							</Fragment>
						);
					}) }
				</List>
			</Drawer>
		</div>
	);
};

export default withRouter(NavDrawer);
