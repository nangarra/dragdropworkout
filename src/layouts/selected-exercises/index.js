import { CircularProgress, Grid, Icon, Paper, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Notification from "components/Notification";
import { setToast, useMaterialUIController } from "context";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem, move, swap } from "react-grid-dnd";
import { useLocation, useParams } from "react-router-dom";
import { getExercises } from "services/exercises";
import ExerciseForm from "./form";
import { saveWorkoutExercises } from "services/selected-exercise";
import Confirmation from "components/Confirmation";
import { deleteExercise } from "services/exercises";
import classNames from "classnames";

const NoExercises = ({ onOpen }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        variant="outlined"
        className="rounded-xl w-full h-[280px] p-4 flex flex-col items-center justify-center gap-4"
      >
        <div className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-lg p-8">
          <Typography>Add an exercise now!</Typography>
          <MDButton size="small" variant="gradient" color="primary" onClick={onOpen}>
            <Icon>add</Icon>&nbsp;Add New
          </MDButton>
        </div>
      </Paper>
    </Grid>
  </Grid>
);

const Exercises = () => {
  const [items, setItems] = useState({ selected: [], exercises: [] });
  const [, dispatch] = useMaterialUIController();
  const [openExerciseForm, setOpenExerciseForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState({});
  const [loading, setLoading] = useState(false);
  const [noExercises, setNoExercises] = useState(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { workoutId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewOnly = !!searchParams.get("type");

  useEffect(() => {
    getExercisesData();
  }, []);

  const getExercisesData = async (options = {}) => {
    setLoading(true);
    try {
      options.workoutId = workoutId;
      const response = await getExercises(options);
      setNoExercises(_.isEmpty(response.data));
      const selected = _.orderBy(
        _.filter(response.data, (row) => !!row.SelectedExercise?.id),
        ["sequence"],
        ["asc"]
      );
      const exercises = _.filter(response.data, (row) => !row.SelectedExercise?.id);
      setItems({ selected, exercises });
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setLoading(false);
  };

  const closeExerciseForm = () => {
    setOpenExerciseForm(false);
    setSelectedExercise({});
    getExercisesData();
  };

  const handleOpenExerciseForm = (exercise) => {
    setOpenExerciseForm(true);
    setSelectedExercise(exercise);
  };

  const onChange = (sourceId, sourceIndex, targetIndex, targetId) => {
    if (targetId) {
      const result = move(items[sourceId], items[targetId], sourceIndex, targetIndex);
      return setItems({
        ...items,
        [sourceId]: result[0],
        [targetId]: result[1],
      });
    }

    const result = swap(items[sourceId], sourceIndex, targetIndex);
    return setItems({
      ...items,
      [sourceId]: result,
    });
  };

  const handleClearSelected = () => {
    const selected = _.cloneDeep(items.selected);
    const list = [...selected, ..._.cloneDeep(items.exercises)];
    setItems({
      selected: [],
      exercises: list,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await saveWorkoutExercises(workoutId, items.selected);
      setToast(
        dispatch,
        <Notification type="success" title="Success!" content="Workout plan created!" />
      );
      getExercisesData();
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setLoading(false);
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

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${window.location.href}?type=view`);
    setToast(
      dispatch,
      <Notification type="info" title="Copied to clipboard!" position="bottom-right" />
    );
  };

  const options = {};
  if (!viewOnly) {
    options.onAddNew = handleOpenExerciseForm;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar {...options} />
      {noExercises && <NoExercises onOpen={handleOpenExerciseForm} />}
      <ExerciseForm
        open={openExerciseForm}
        exercise={selectedExercise}
        onClose={closeExerciseForm}
      />
      <Confirmation
        loading={deleting}
        open={confirm}
        title="Delete Exercise"
        message="Are you sure you want to delete this exercise?"
        onClose={closeConfirmDeleteExercise}
        onConfirm={deleteExerciseConfirmed}
      />

      <MDBox py={3}>
        <div className="flex items-center gap-8 py-2">
          {!noExercises && (
            <Typography variant="h5" className="flex justify-between w-full">
              Selected Exercises
              <AnimatePresence mode="wait">
                {!_.isEmpty(items.selected) && !viewOnly && (
                  <div className="flex items-center justify-end gap-2">
                    <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <MDButton
                        size="small"
                        color="primary"
                        variant="gradient"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={10} color="white" /> : <Icon>save</Icon>}
                        &nbsp;Save Workout Plan
                      </MDButton>
                    </motion.div>
                    <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <MDButton
                        size="small"
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                        onClick={copyToClipboard}
                      >
                        <Icon>content_copy</Icon>&nbsp;Copy Link
                      </MDButton>
                    </motion.div>
                    <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <MDButton
                        disabled={loading}
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={handleClearSelected}
                      >
                        Clear
                      </MDButton>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </Typography>
          )}
          {!noExercises && !viewOnly && (
            <Typography variant="h5" className="w-[17%] text-start">
              Exercises
            </Typography>
          )}
        </div>
        {!noExercises && (
          <GridContextProvider onChange={onChange}>
            <div className="flex gap-8 w-full h-[580px] overflow-y-auto relative">
              {viewOnly && <div className="w-full h-full absolute z-50" />}
              <GridDropZone
                id="selected"
                boxesPerRow={3}
                rowHeight={185}
                className={classNames(
                  "bg-white border border-gray-300 grid justify-center p-4 rounded-lg",
                  viewOnly ? "w-[50%]" : "w-full"
                )}
              >
                {items.selected.map((item, index) => (
                  <GridItem
                    key={item.id}
                    className="grid justify-center p-4 cursor-grab"
                    style={{ width: "auto" }}
                  >
                    <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                      <Paper
                        variant="outlined"
                        className="w-[170px] h-[170px] relative hover:shadow-md"
                      >
                        <div className="absolute z-50 right-0 left-0 top-0 bottom-0"></div>

                        <div className="flex flex-col justify-between h-full">
                          <div className="text-sm flex items-center gap-2 p-2 border-b">
                            <b className="flex justify-center items-center text-gray-500 border border-gray-500 rounded-full w-[22px]">
                              {index + 1}
                            </b>
                            <b className="text-gray-500 text-xs">{item.title}</b>
                          </div>

                          <div className="grid justify-center items-center pb-2">
                            <img src={item.thumbnail} className="h-[120px] w-fit" />
                          </div>
                        </div>
                      </Paper>
                    </motion.div>
                  </GridItem>
                ))}
              </GridDropZone>

              {!viewOnly && (
                <GridDropZone
                  id="exercises"
                  boxesPerRow={1}
                  rowHeight={185}
                  className="flex flex-col items-start rounded-lg w-[17%] relative"
                >
                  {items.exercises.map((item) => (
                    <GridItem
                      key={item.id}
                      className="grid justify-center"
                      style={{ width: "auto" }}
                    >
                      <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                        <Paper
                          variant="outlined"
                          className="w-[170px] h-[170px] relative hover:shadow-md"
                        >
                          <div className="absolute z-20 right-0 left-0 top-0 bottom-0 cursor-grab"></div>

                          <b className="flex items-center text-xs p-2 border-b">{item.title}</b>

                          <div className="grid justify-center w-full">
                            <img src={item.thumbnail} className="h-[110px] w-fit" />
                          </div>
                          <div className="flex items-center justify-center border-t p-1 text-gray-400 h-[30px] z-50 absolute bottom-0 right-0 left-0">
                            <MDButton
                              size="small"
                              variant="text"
                              color="primary"
                              onClick={() => handleOpenExerciseForm(item)}
                            >
                              <Icon>edit</Icon>&nbsp;Edit
                            </MDButton>
                            <MDButton
                              size="small"
                              variant="text"
                              color="error"
                              onClick={() => confirmDeleteExercise(item.id)}
                            >
                              <Icon>delete</Icon>&nbsp;Delete
                            </MDButton>
                          </div>
                        </Paper>
                      </motion.div>
                    </GridItem>
                  ))}
                </GridDropZone>
              )}
            </div>
          </GridContextProvider>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Exercises;
