import {
  AppBar,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
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
import BasicLayout from "layouts/authentication/components/BasicLayout";
import MDInput from "components/MDInput";
import { AccountCircle } from "@mui/icons-material";
import { getNutritions } from "services/nutritions";
import NutritionsList from "./list/nutritions";
import ExercisesList from "./list/exercises";
import SelectedExercises from "./list/selectedExercises";
import { DragDropContext } from "react-beautiful-dnd";

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

const INITIAL_STATE = {
  title: "Workout title",
  description: "Workout description",
};

const TABS = {
  EXERCISES: 0,
  NUTRITIONS: 1,
};

const TabContent = ({ children, selectedTab, ...props }) => {
  if (selectedTab === TABS.EXERCISES) {
    return <ExercisesList {...props} />;
  }

  if (selectedTab === TABS.NUTRITIONS) {
    return <NutritionsList {...props} />;
  }
};

const WorkoutBuilder = () => {
  const [items, setItems] = useState({ selected: [], exercises: [] });
  const [, dispatch] = useMaterialUIController();
  const [openExerciseForm, setOpenExerciseForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState({});
  const [loading, setLoading] = useState(false);
  const [noExercises, setNoExercises] = useState(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewOnly = !!searchParams.get("type");

  const [workout, setWorkout] = useState(INITIAL_STATE);
  const [titleEdit, setTitleEdit] = useState(false);
  const [descEdit, setDescEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS.EXERCISES);
  const [exercises, setExercises] = useState([]);
  const [nutritions, setNutritions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hoveredPlace, setHoveredPlace] = useState(null);

  useEffect(() => {
    getExercisesData();
    getNutritionsData();
  }, []);

  const getExercisesData = async (options = {}) => {
    setLoading(true);
    try {
      const response = await getExercises(options);
      setNoExercises(_.isEmpty(response.data));
      // const selected = _.orderBy(
      //   _.filter(response.data, (row) => !!row.SelectedExercise?.id),
      //   ["sequence"],
      //   ["asc"]
      // );
      // const exercises = _.filter(response.data, (row) => !row.SelectedExercise?.id);
      // setItems({ selected, exercises });
      setExercises(response.data);
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setLoading(false);
  };

  const getNutritionsData = async (options = {}) => {
    setLoading(true);
    try {
      const response = await getNutritions(options);
      setNoExercises(_.isEmpty(response.data));
      // const selected = _.orderBy(
      //   _.filter(response.data, (row) => !!row.SelectedExercise?.id),
      //   ["sequence"],
      //   ["asc"]
      // );
      // const exercises = _.filter(response.data, (row) => !row.SelectedExercise?.id);
      // setItems({ selected, exercises });
      setNutritions(response.data);
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
    getNutritionsData();
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
    getExercisesData();
    getNutritionsData();
    setSelected([]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await saveWorkoutExercises(items.selected);
      setToast(
        dispatch,
        <Notification type="success" title="Success!" content="Workout plan created!" />
      );
      getExercisesData();
      getNutritionsData();
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setLoading(false);
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

  const handleWorkoutChange = (e) => {
    const { value, name } = e.target;
    setWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (_, value) => {
    setSelectedTab(value);
  };

  const onDragEnd = (result) => {
    setHoveredPlace(null);
    if (!result.destination) return;

    const selectedExercises = _.cloneDeep(selected);
    console.log("onDragEnd", result);
    console.log("condition 1", String(result.destination.droppableId).includes("selected"));
    console.log("condition 2", String(result.source.droppableId) === "even");

    console.log("destination", result.destination.droppableId);
    console.log("source", result.source.droppableId);

    if (
      String(result.destination.droppableId) !== "even" &&
      String(result.destination.droppableId) !== "odd" &&
      (String(result.source.droppableId) === "even" || String(result.source.droppableId) === "odd")
    ) {
      const draggedItem =
        _.find(exercises, (row) => row.id === result.draggableId) ||
        _.find(nutritions, (row) => row.id === result.draggableId);

      console.log("dragged to Selected", draggedItem);

      if (_.isEmpty(selected)) {
        selectedExercises.push(draggedItem);
        setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
        setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
      } else if (+result.destination.droppableId > selectedExercises.length) {
        selectedExercises.push(draggedItem);
        setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
        setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
      } else {
      }
    }

    setSelected(selectedExercises);
  };

  const onDragUpdate = (result) => {
    if (!result.destination) {
      setHoveredPlace(null);
      return;
    }
    setHoveredPlace(result.destination?.droppableId);
  };

  return (
    <BasicLayout>
      <div className="container mx-auto">
        <Grid container spacing={2}>
          <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            {/* --------------- Selected Exercises & Nutritions */}
            <Grid item xs={8}>
              <div className="flex flex-col gap-4">
                <Grid container spacing={4}>
                  <Grid item xs={9}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center gap-4 h-[40px]">
                        {titleEdit ? (
                          <Input
                            name="title"
                            className="w-full"
                            style={{ fontSize: 30 }}
                            placeholder="Title"
                            value={workout.title}
                            onChange={handleWorkoutChange}
                          />
                        ) : (
                          <Typography variant="h3">{workout.title}</Typography>
                        )}
                        {titleEdit ? (
                          <MDButton
                            variant="gradient"
                            color="primary"
                            size="small"
                            onClick={() => setTitleEdit(false)}
                          >
                            Done
                          </MDButton>
                        ) : (
                          <MDButton
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => setTitleEdit(true)}
                          >
                            Edit
                          </MDButton>
                        )}
                      </div>
                      <div className="flex justify-between items-center gap-4 h-[40px]">
                        {descEdit ? (
                          <Input
                            multiline
                            name="description"
                            className="w-full"
                            style={{ fontSize: 18 }}
                            placeholder="Description"
                            value={workout.description}
                            onChange={handleWorkoutChange}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            className="flex justify-between items-center gap-4 h-[40px]"
                          >
                            {workout.description}
                          </Typography>
                        )}
                        {descEdit ? (
                          <MDButton
                            variant="gradient"
                            color="primary"
                            size="small"
                            onClick={() => setDescEdit(false)}
                          >
                            Done
                          </MDButton>
                        ) : (
                          <MDButton
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => setDescEdit(true)}
                          >
                            Edit
                          </MDButton>
                        )}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="flex justify-end items-end h-full gap-2">
                      <Tooltip title="Reset">
                        <div className="border rounded-full border-[#7560C5] bg-white">
                          <IconButton
                            color="primary"
                            aria-label="Add"
                            onClick={handleClearSelected}
                          >
                            <Icon fontSize="small">refresh</Icon>
                          </IconButton>
                        </div>
                      </Tooltip>
                      <Tooltip title="Send">
                        <div className="border rounded-full border-[#7560C5] bg-white">
                          <IconButton
                            color="primary"
                            aria-label="Add"
                            onClick={() => setDescEdit(false)}
                          >
                            <Icon fontSize="small">send</Icon>
                          </IconButton>
                        </div>
                      </Tooltip>
                      <Tooltip title="Save">
                        <div className="border rounded-full border-[#7560C5] bg-white">
                          <IconButton
                            color="primary"
                            aria-label="Add"
                            onClick={() => setDescEdit(false)}
                          >
                            <Icon fontSize="small">save</Icon>
                          </IconButton>
                        </div>
                      </Tooltip>
                    </div>
                  </Grid>
                </Grid>
                <MDBox width="100%" p={4} bgColor="white" className="rounded-xl">
                  <SelectedExercises data={selected} hoveredPlace={hoveredPlace} />
                </MDBox>
              </div>
            </Grid>

            {/* --------------- Exercises & Nutritions */}
            <Grid item xs={4}>
              <div className="flex flex-col gap-5">
                <MDBox
                  width="100%"
                  px={4}
                  pb={4}
                  pt={3}
                  variant="gradient"
                  bgColor="primary"
                  borderRadius="lg"
                  coloredShadow="primary"
                >
                  <Input
                    style={{ color: "white", width: "100%", fontSize: 18 }}
                    placeholder="Search by name"
                    color="secondary"
                    startAdornment={
                      <InputAdornment position="start">
                        <Icon className="text-white">search</Icon>
                      </InputAdornment>
                    }
                  />
                </MDBox>
                <MDBox width="100%" p={2} bgColor="white" className="rounded-xl">
                  <AppBar position="static" className="mb-2">
                    <Tabs orientation="horizontal" value={selectedTab} onChange={handleTabChange}>
                      <Tab label="Exercises" />
                      <Tab label="Nutritions" />
                    </Tabs>
                  </AppBar>
                  {selectedTab === TABS.EXERCISES && <ExercisesList data={exercises} />}
                  {selectedTab === TABS.NUTRITIONS && <NutritionsList data={nutritions} />}
                </MDBox>
              </div>
            </Grid>
          </DragDropContext>
          {/* <Grid item xs={12}>
            <MDBox pt={3}>
              <div className="flex items-center gap-8 py-2">
                <Typography variant="h5" className="flex justify-between w-full">
                  Selected Exercises
                  <AnimatePresence mode="wait">
                    {!_.isEmpty(items.selected) && !viewOnly && (
                      <div className="flex items-center justify-end gap-2">
                        <motion.div
                          initial={{ scale: 0.7 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <MDButton
                            size="small"
                            color="primary"
                            variant="gradient"
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            {loading ? (
                              <CircularProgress size={10} color="white" />
                            ) : (
                              <Icon>save</Icon>
                            )}
                            &nbsp;Save Workout Plan
                          </MDButton>
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.7 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
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
                        <motion.div
                          initial={{ scale: 0.7 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
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
                <Typography variant="h5" className="w-[17%] text-start">
                  Exercises
                </Typography>
              </div>
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
            </MDBox>
          </Grid> */}
        </Grid>
      </div>
    </BasicLayout>
  );
};

export default WorkoutBuilder;
