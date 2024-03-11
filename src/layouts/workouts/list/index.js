import { Card, Grid, Icon, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import Confirmation from "components/Confirmation";
import Loading from "components/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteWorkout, getWorkouts } from "services/workouts";

const Loader = () => (
  <>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
  </>
);

const NoWorkouts = ({ onOpen }) => (
  <Grid item xs={12} md={6} lg={3}>
    <Paper
      variant="outlined"
      className="rounded-xl w-full h-[280px] p-4 flex flex-col items-center justify-center gap-4"
    >
      <div className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-lg p-8">
        <Typography>Add Workouts Now!</Typography>
        <MDButton size="small" variant="gradient" color="primary" onClick={onOpen}>
          <Icon>add</Icon>&nbsp;Add New
        </MDButton>
      </div>
    </Paper>
  </Grid>
);

const WorkoutList = (props) => {
  const { onOpen, getData } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [noWorkouts, setNoWorkouts] = useState(false);
  const [hover, setHover] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleteWorkoutId, setDeleteWorkoutId] = useState(null);

  useEffect(() => {
    getWorkoutsData();
  }, []);

  useEffect(() => {
    if (getData) {
      getWorkoutsData();
    }
  }, [getData]);

  const getWorkoutsData = async () => {
    setLoading(true);
    const response = await getWorkouts();
    setNoWorkouts(_.isEmpty(response.data));
    setWorkouts(response.data);
    setLoading(false);
  };

  const gotoExercises = (id) => {
    navigate(`/exercises/${id}`);
  };

  const editWorkout = (workout) => {
    onOpen(workout);
  };

  const confirmDeleteWorkout = (id) => {
    setConfirm(true);
    setDeleteWorkoutId(id);
  };

  const closeConfirmDeleteWorkout = () => {
    setConfirm(false);
    setDeleteWorkoutId(null);
  };

  const deleteWorkoutConfirmed = async () => {
    const response = await deleteWorkout(deleteWorkoutId);

    closeConfirmDeleteWorkout();
    getWorkoutsData();
  };

  return (
    <MDBox py={3}>
      <Confirmation
        open={confirm}
        title="Delete Workout"
        message="Are you sure you want to delete this workout?"
        onClose={closeConfirmDeleteWorkout}
        onConfirm={deleteWorkoutConfirmed}
      />
      <Grid container spacing={3}>
        <Loading loading={loading} customLoader={<Loader />}>
          {noWorkouts && <NoWorkouts onOpen={onOpen} />}
          {workouts.map((row) => (
            <Grid
              key={row.id}
              item
              xs={12}
              md={6}
              lg={3}
              onMouseEnter={() => setHover(row.id)}
              onMouseLeave={() => setHover(null)}
            >
              <motion.div key={row.id} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Card className="cursor-pointer">
                  <div
                    onClick={() => gotoExercises(row.id)}
                    className="flex justify-center p-4 h-[210px] border-b border-gray-300"
                  >
                    <img
                      src={row.thumbnail || "/img/no-image.png"}
                      className={`h-full w-fit ${row.thumbnail ? "" : "opacity-50"}`}
                    />
                  </div>
                  <div className="p-4">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="flex items-center justify-between"
                    >
                      <span>{row.title}</span>
                      <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                          <Icon
                            className="text-gray-400 hover:text-blue-400"
                            onClick={() => editWorkout(row)}
                          >
                            edit
                          </Icon>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Icon
                            className="text-gray-400 hover:text-red-400"
                            onClick={() => confirmDeleteWorkout(row.id)}
                          >
                            delete_forever
                          </Icon>
                        </Tooltip>
                      </div>
                    </Typography>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: hover === row.id ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {row.description}
                      </Typography>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Loading>
      </Grid>
    </MDBox>
  );
};

export default WorkoutList;
