import { Grid, Icon, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import Confirmation from "components/Confirmation";
import Loading from "components/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useState } from "react";
import { deleteExercise, getExercises } from "services/exercises";

const Loader = () => (
  <>
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    </Grid>
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    </Grid>
  </>
);

const NoExercises = ({ onOpen }) => (
  <Grid item xs={12} sm={4}>
    <Paper
      variant="outlined"
      className="cursor-pointer hover:shadow-md relative overflow-hidden "
      style={{ borderRadius: 8 }}
    >
      <div className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-lg p-8">
        <Typography variant="h4">Add Exercises Now!</Typography>
        <MDButton size="small" variant="gradient" color="primary" onClick={onOpen}>
          <Icon>add</Icon>&nbsp;Add New
        </MDButton>
      </div>
    </Paper>
  </Grid>
);

const ExerciseList = (props) => {
  const { onOpen, getData } = props;
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [noExercises, setNoExercises] = useState(false);
  const [hover, setHover] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
    setDeleting(true);
    const response = await deleteExercise(deleteExerciseId);
    setDeleting(false);
    closeConfirmDeleteExercise();
    getExercisesData();
  };

  return (
    <MDBox>
      <Confirmation
        loading={deleting}
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
              key={row.id}
              onMouseLeave={() => setHover(null)}
              onMouseEnter={() => setHover(row.id)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Paper
                  variant="outlined"
                  className="cursor-pointer hover:shadow-md relative overflow-hidden"
                  style={{ borderRadius: 8 }}
                >
                  <div className="flex justify-center h-[160px] border-b border-gray-300">
                    <img
                      src={row.thumbnail || "/img/no-image.png"}
                      className={`w-1/2 object-cover ${row.thumbnail ? "" : "opacity-50"}`}
                    />
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hover === row.id ? "auto" : 0 }}
                    className="absolute top-0 right-0 grid w-full h-[159px] justify-end overflow-hidden z-50 bg-white"
                  >
                    <div className="flex flex-col items-center gap-2 p-2">
                      <Tooltip title="Edit" placement="right">
                        <Icon
                          onClick={() => editExercise(row)}
                          className="text-gray-400 hover:text-blue-400"
                        >
                          edit
                        </Icon>
                      </Tooltip>
                      <Tooltip title="Delete" placement="right">
                        <Icon
                          onClick={() => confirmDeleteExercise(row.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          delete_forever
                        </Icon>
                      </Tooltip>
                    </div>
                  </motion.div>
                  <div className="py-2 px-4">
                    <Typography
                      gutterBottom
                      variant="p"
                      component="div"
                      className="flex items-center justify-between text-sm font-semibold"
                    >
                      <span>{row.title}</span>
                    </Typography>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: hover === row.id ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
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
