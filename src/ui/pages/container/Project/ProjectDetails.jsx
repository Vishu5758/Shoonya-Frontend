import { Box, Button, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import TaskTable from "../../component/Project/TaskTable"
import MembersTable from "../../component/Project/MembersTable"
import ReportsTable from "../../component/Project/ReportsTable"
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { translate } from "../../../../config/localisation";
// import TabPanel from "../../component/common/TabPanel";
import addUserTypes from "../../../../constants/addUserTypes";



const menuOptions = [
    { name: "Tasks", isChecked: false, component: () => null },
    { name: "Members", isChecked: false, component: () => null },
    { name: "Reports", isChecked: true, component: () => null }
]

function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


const Projects = () => {
    // console.log("props", props)
    const { id } = useParams();
    const [projectData, setProjectData] = useState([
        { name: "Project ID", value: null },
        { name: "Description", value: null },
        { name: "Project Type", value: null },
        { name: "Status", value: null },
        { name: "Unassigned Task", value: null },
        { name: "Total Labeled Task", value: null },
    ])

    const dispatch = useDispatch();
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);

    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);

        dispatch(APITransport(projectObj));
    }
    console.log(ProjectDetails, "test");

    useEffect(() => {
        getProjectDetails();
        const projectStatus = ProjectDetails.is_published ? "Published" : ProjectDetails.is_archived ? "Archived" : "Draft";
        setProjectData([
            {
                name: "Project ID",
                value: ProjectDetails.id
            },
            {
                name: "Description",
                value: ProjectDetails.description
            },
            {
                name: "Project Type",
                value: ProjectDetails.project_type
            },
            {
                name: "Status",
                value: projectStatus
            },
            {
                name: "Unassigned Task",
                value: ProjectDetails.unassigned_task_count
            },
            {
                name: "Total Labeled Task",
                value: ProjectDetails.labeled_task_count
            },
        ])
    }, []);


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const isMember = userDetails.role!==1 || ProjectDetails?.users?.some((user) => user.id === userDetails.id);
    const isReviewer = ProjectDetails?.enable_task_reviews && (userDetails?.role !== 1 || ProjectDetails?.annotation_reviewers?.some((reviewer) => reviewer.id === userDetails?.id));

    return (
        <ThemeProvider theme={themeDefault}>
            {/* <Header /> */}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Card
                    sx={{
                        // width: window.innerWidth * 0.8,
                        width: "100%",
                        minHeight: 500,
                        padding: 5
                    }}
                >
                  
                    <Typography variant="h3">{ProjectDetails.title}</Typography>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Project ID :</Typography>
                        <Typography variant="body2">{ProjectDetails.id}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Description :</Typography>
                        <Typography variant="body2">{ProjectDetails.description}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Project Type :</Typography>
                        <Typography variant="body2">{ProjectDetails.project_type}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Status :</Typography>
                        <Typography variant="body2">{ProjectDetails.is_published ? "Published" : ProjectDetails.is_archived ? "Archived" : "Draft"}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Unassigned Annotation Tasks :</Typography>
                        <Typography variant="body2">{ProjectDetails.unassigned_task_count}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Unassigned Review Tasks :</Typography>
                        <Typography variant="body2">{ProjectDetails.labeled_task_count}</Typography>
                    </Grid>
                    {userDetails?.role !== 1 && <Link to={`/projects/${id}/projectsetting`} style={{ textDecoration: "none" }}>
                        <Button
                            sx={{
                                marginTop: 2,
                                marginBottom: 2,
                                padding: 1,
                                backgroundColor: "primary.main",
                                borderRadius: 2
                            }}
                            variant="contained"
                        >
                            <Typography variant="body2" sx={{color : "#FFFFFF"}}>{translate("label.showProjectSettings")}</Typography>
                        </Button>
                    </Link>}
                    <Box>
                        <Tabs value={value} onChange={handleChange} aria-label="nav tabs example" TabIndicatorProps={{ style: { backgroundColor: "#FD7F23 " } }}>
                            {isMember && <Tab label={translate("label.annotationTasks")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {isReviewer && <Tab label={translate("label.reviewTasks")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            {isReviewer && <Tab label={translate("label.reviewers")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            <Tab label={translate("label.reports")} sx={{ fontSize: 16, fontWeight: '700' }} />
                        </Tabs>
                    </Box>
                    {isMember && <TabPanel value={value} index={0}>
                        <TaskTable type="annotation"/>
                    </TabPanel>}
                    {isReviewer && <TabPanel value={value} index={isMember ? 1 : 0}>
                        <TaskTable type="review"/>
                    </TabPanel>}
                    <TabPanel value={value} index={isMember ? isReviewer ? 2 : 1 : 1}>
                        <MembersTable dataSource={ProjectDetails.users} type={addUserTypes.PROJECT_MEMBER} />
                    </TabPanel>
                    {isReviewer && <TabPanel value={value} index={isMember ? 3 : 2}>
                        <MembersTable dataSource={ProjectDetails.annotation_reviewers} type={addUserTypes.PROJECT_REVIEWER} />
                    </TabPanel>}
                    <TabPanel value={value} index={isMember ? isReviewer ? 4 : 2 : 2}>
                        <ReportsTable />
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>
    )
}

export default Projects;