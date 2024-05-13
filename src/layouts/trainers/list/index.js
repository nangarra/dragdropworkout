import { Card, CircularProgress, Grid } from "@mui/material";
import Confirmation from "components/Confirmation";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import dayjs from "dayjs";
import DataTable from "examples/Tables/DataTable";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { deleteTrainer, getTrainers } from "services/trainers";

const Loader = ({ loading, children }) => {
  if (loading) {
    return (
      <>
        <div className="grid justify-center items-center absolute z-30 top-0 right-0 left-0 bottom-0 w-full h-full">
          <div className="loader-lg"></div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
};

const TrainerList = () => {
  const [controller] = useMaterialUIController();
  const { loggedInUser } = controller;
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTrainerId, setDeleteTrainerId] = useState(null);

  useEffect(() => {
    getTrainersData();
  }, []);

  const getTrainersData = async () => {
    setLoading(true);
    const options = {};
    if (!loggedInUser?.SuperUser) {
      options.trainerId = loggedInUser?.id;
    }
    try {
      const response = await getTrainers(options);
      const data = setData(response.data);
      setTrainers(data);
    } catch (error) {}
    setLoading(false);
  };

  const closeConfirmDeleteTrainer = () => {
    setConfirm(false);
    setDeleteTrainerId(null);
  };
  const confirmDeleteTrainer = (id) => {
    setConfirm(true);
    setDeleteTrainerId(id);
  };

  const deleteTrainerConfirmed = async () => {
    setDeleting(true);
    const response = await deleteTrainer(deleteTrainerId);
    setDeleting(false);
    closeConfirmDeleteTrainer();
    getTrainersData();
  };

  const setData = (data = []) => {
    return _.map(data, (row) => ({
      ...row,
      username: <b>{row.username}</b>,
      // description: <MDTypography variant="caption">{row.description}</MDTypography>,
      assignedWorkouts: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {row.AssignedWorkout?.length}
        </MDTypography>
      ),
      createdAt: dayjs(row.createdAt).format("MM/DD/YYYY"),
      action: (
        <div className="flex items-center gap-2">
          <MDButton
            size="small"
            variant="gradient"
            color="error"
            onClick={() => confirmDeleteTrainer(row.id)}
          >
            Delete
          </MDButton>
        </div>
      ),
    }));
  };

  const cols = [
    { Header: "name", accessor: "username", align: "left" },
    { Header: "assigned workouts", accessor: "assignedWorkouts", align: "left" },
    { Header: "joined", accessor: "createdAt", align: "left" },
    { Header: "actions", accessor: "action", align: "right" },
  ];

  const columnHeaders = _.map(cols, "Header");
  const columns = useMemo(() => cols, columnHeaders);

  const generateLink = () => {
    setGenerating(true);

    setTimeout(() => {
      const inviteLink = `${window.origin}/invitations/${loggedInUser?.id}`;
      window.open(inviteLink);
      setGenerating(false);
    }, 1500);
  };

  return (
    <MDBox p={2}>
      <Confirmation
        open={confirm}
        loading={deleting}
        title="Delete Trainer"
        message="Are you sure you want to delete this trainer?"
        onClose={closeConfirmDeleteTrainer}
        onConfirm={deleteTrainerConfirmed}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="primary"
              borderRadius="lg"
              coloredShadow="primary"
            >
              <MDTypography
                variant="h6"
                color="white"
                className="flex w-full justify-between items-center"
              >
                Trainer Listings
                <MDButton size="small" variant="contained" color="white" onClick={generateLink}>
                  {generating && <CircularProgress size={10} color="primary" />}&nbsp;Generate
                  Invite
                </MDButton>
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              <Grid container spacing={2} className="p-4">
                <Grid item xl={1.2}></Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className="relative overflow-hidden">
            <Loader loading={loading}>
              <MDBox>
                <DataTable
                  table={{ columns, rows: trainers }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 10, entries: [10, 25, 50, 100] }}
                  showTotalEntries
                  noEndBorder
                />
              </MDBox>
            </Loader>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default TrainerList;
