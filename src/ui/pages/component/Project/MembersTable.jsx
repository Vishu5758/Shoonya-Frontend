// MembersTable

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import CustomButton from "../common/Button";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import { PersonAddAlt } from "@mui/icons-material";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import AddUsersDialog from "../common/AddUsersDialog";
import InviteUsersDialog from "../common/InviteUsersDialog";
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import AddMembersToProjectAPI from "../../../../redux/actions/api/ProjectDetails/AddMembersToProject";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import addUserTypes from "../../../../constants/addUserTypes";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

const columns = [
    {
        name: "Name",
        label: "Name",
        options: {
            filter: false,
            sort: false,
            align: "center",
        },
    },
    {
        name: "Email",
        label: "Email",
        options: {
            filter: false,
            sort: false,
        },
    },
    {
        name: "Role",
        label: "Role",
        options: {
            filter: false,
            sort: false,
        },
    },
    {
        name: "Actions",
        label: "Actions",
        options: {
            filter: false,
            sort: false,
        },
    },
];

const options = {
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
};

const addLabel = {
    organization: "Invite Users to Organization",
    [addUserTypes.PROJECT_MEMBER]: "Add Users to Project",
    [addUserTypes.PROJECT_REVIEWER]: "Add Reviewers to Project",
}

const MembersTable = (props) => {
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const { orgId, id } = useParams();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState();

    const { dataSource, hideButton } = props;

    const userDetails = useSelector(state=>state.fetchLoggedInUserData.data);

    useEffect(() => {
        userDetails && setUserRole(userDetails.role);
    }, [])

    const handleUserDialogClose = () => {
        setAddUserDialogOpen(false);
    };

    const handleUserDialogOpen = () => {
        setAddUserDialogOpen(true);
    };

    const data =
        dataSource && dataSource.length > 0
            ? dataSource.map((el, i) => {
                const userRole = el.role && UserMappedByRole(el.role).element;
                return [
                    el.username,
                    el.email,
                    userRole ? userRole : el.role,
                    <CustomButton
                        sx={{ p: 1, borderRadius: 2 }}
                        onClick={() => {
                            navigate(`/profile/${el.id}`);
                        }}
                        label={"View"}
                    />,
                ];
            })
            : [];
            const options = {
                textLabels: {
                  body: {
                    noMatch: "No records",
                  },
                  toolbar: {
                    search: "Search",
                    viewColumns: "View Column",
                  },
                  pagination: { rowsPerPage: "Rows per page" },
                  options: { sortDirection: "desc" },
                },
                // customToolbar: fetchHeaderButton,
                displaySelectToolbar: false,
                fixedHeader: false,
                filterType: "checkbox",
                download: false,
                print: false,
                rowsPerPageOptions: [10, 25, 50, 100],
                // rowsPerPage: PageInfo.count,
                filter: false,
                // page: PageInfo.page,
                viewColumns: false,
                selectableRows: "none",
                search: false,
                jumpToPage: true,
              };
    

    return (
        <React.Fragment>
            {userRole !== 1 && !hideButton ?
            <CustomButton
                sx={{ borderRadius: 2, mb: 3, whiteSpace: "nowrap" }}
                startIcon={<PersonAddAlt />}
                label={props.type ? addLabel[props.type] : "Add Users"}
                fullWidth
                onClick={handleUserDialogOpen}
            /> : null
            }
            {props.type === "organization" ?  
                <InviteUsersDialog
                    handleDialogClose={handleUserDialogClose}
                    isOpen={addUserDialogOpen}
                    id={orgId}
                />
                : 
                <AddUsersDialog
                    handleDialogClose={handleUserDialogClose}
                    isOpen={addUserDialogOpen}
                    userType={props.type}
                    id={id}
                />
            }
            <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                    // filter={false}
                />
            </ThemeProvider>
        </React.Fragment>
    );
};

export default MembersTable;
