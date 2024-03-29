import { Card, Grid, Icon, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import Confirmation from "components/Confirmation";
import Loading from "components/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExercises, deleteExercise } from "services/exercises";

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

const NoExercises = ({ onOpen }) => (
  <Grid item xs={12} md={6} lg={3}>
    <Paper
      variant="outlined"
      className="rounded-xl w-full h-[280px] p-4 flex flex-col items-center justify-center gap-4"
    >
      <div className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-lg p-8">
        <Typography>Add Exercises Now!</Typography>
        <MDButton size="small" variant="gradient" color="primary" onClick={onOpen}>
          <Icon>add</Icon>&nbsp;Add New
        </MDButton>
      </div>
    </Paper>
  </Grid>
);

const ExerciseList = (props) => {
  const { onOpen, getData } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [noExercises, setNoExercises] = useState(false);
  const [hover, setHover] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState(null);

  useEffect(() => {
    getExercisesData();
  }, []);

  useEffect(() => {
    if (getData) {
      getExercisesData();
    }
  }, [getData]);

  const getExercisesData = async () => {
    setLoading(true);
    const response = await getExercises();
    setNoExercises(_.isEmpty(response.data));
    setExercises(response.data);
    setLoading(false);
  };

  const gotoExercises = (id) => {
    navigate(`/exercises/${id}`);
  };

  const editExercise = (exercise) => {
    onOpen(exercise);
  };

  const confirmDeleteExercise = (id) => {
    setConfirm(true);
    setDeleteExerciseId(id);
  };

  const closeConfirmDeleteExercise = () => {
    setConfirm(false);
    setDeleteExerciseId(null);
  };

  const deleteExerciseConfirmed = async () => {
    const response = await deleteExercise(deleteExerciseId);

    closeConfirmDeleteExercise();
    getExercisesData();
  };

  return (
    <MDBox py={3}>
      <Confirmation
        open={confirm}
        title="Delete Exercise"
        message="Are you sure you want to delete this exercise?"
        onClose={closeConfirmDeleteExercise}
        onConfirm={deleteExerciseConfirmed}
      />
      <Grid container spacing={3}>
        <Loading loading={loading} customLoader={<Loader />}>
          {noExercises && <NoExercises onOpen={onOpen} />}
          {exercises.map((row) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={row.id}
              onMouseLeave={() => setHover(null)}
              onMouseEnter={() => setHover(row.id)}
            >
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Paper variant="outlined" className="cursor-pointer hover:shadow-md relative">
                  <div
                    onClick={() => gotoExercises(row.id)}
                    className="flex justify-center p-4 h-[140px] border-b border-gray-300"
                  >
                    <img
                      src={row.thumbnail || "/img/no-image.png"}
                      className={`h-full w-fit ${row.thumbnail ? "" : "opacity-50"}`}
                    />
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hover === row.id ? "auto" : 0 }}
                    className="absolute top-0 right-0 grid w-full h-[139px] justify-end overflow-hidden z-50 bg-gradient-to-r from-transparent to-gray-300"
                  >
                    <div className="flex flex-col items-center gap-2 p-2">
                      <Tooltip title="Edit">
                        <Icon
                          onClick={() => editExercise(row)}
                          className="text-gray-400 hover:text-blue-400"
                        >
                          edit
                        </Icon>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Icon
                          onClick={() => confirmDeleteExercise(row.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          delete_forever
                        </Icon>
                      </Tooltip>
                    </div>
                  </motion.div>
                  <div className="p-4">
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      className="flex items-center justify-between"
                    >
                      <span>{row.title}</span>
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
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Loading>
      </Grid>
    </MDBox>
  );
};

export default ExerciseList;
