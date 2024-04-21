import {
  AppBar,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import Notification from "components/Notification";
import { NUTRITION_TYPE } from "constants";
import { setToast, useMaterialUIController } from "context";
import { useTitleCase } from "hooks";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import _ from "lodash";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { getExercises } from "services/exercises";
import { getNutritions } from "services/nutritions";
import { createWorkout } from "services/workouts";
import EditForm from "./form";
import ExercisesList from "./list/exercises";
import NutritionsList from "./list/nutritions";
import SelectedExercises from "./list/selectedExercises";
import MDButton from "components/MDButton";

const INITIAL_STATE = {
  title: null,
  description: null,
};

const TYPES = {
  EXERCISES: "exercises",
  NUTRITIONS: "nutritions",
};

const TABS = {
  EXERCISES: 0,
  NUTRITIONS: 1,
};

const BUTTON_EXERCISE_FILTERS = ["fitness", "cardio", "strength", "calisthenics"];
const BUTTON_NUTRITION_FILTERS = ["protein shake", "steak", "eggs", "creatine"];

const WorkoutBuilder = () => {
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [workout, setWorkout] = useState(INITIAL_STATE);
  const [titleEdit, setTitleEdit] = useState(false);
  const [descEdit, setDescEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS.EXERCISES);
  const [exercises, setExercises] = useState([]);
  const [nutritions, setNutritions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [buttonFilters, setButtonFilters] = useState([]);
  const [error, setError] = useState({
    title: false,
    description: false,
    selected: false,
    "unique-title": false,
  });
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearch("");
    getExercisesData();
    getNutritionsData();
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === TABS.EXERCISES) {
      getExercisesData({ search });
    }
    if (selectedTab === TABS.NUTRITIONS) {
      getNutritionsData({ search });
    }
  }, [search, buttonFilters]);

  useEffect(() => {
    if (workout.title) {
      setError((prev) => ({ ...prev, title: false }));
    }
  }, [titleEdit]);

  useEffect(() => {
    if (!_.isEmpty(selected)) {
      setError((prev) => ({ ...prev, selected: false }));
    }
  }, [selected]);

  useEffect(() => {
    const body = document.body;
    if (loading) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
    return () => {
      body.style.overflow = "auto";
    };
  }, [loading]);

  const getExercisesData = async (options = {}) => {
    try {
      setFetching(true);
      options.discipline = buttonFilters;
      options = _.pickBy(options, _.identity);
      const response = await getExercises(options);
      const data = _.map(response.data, (row) => ({ ...row, type: "exercises" }));
      // const filtered = _.filter(data, (row) => !_.find(selected, (sel) => sel.id === row.id));
      setExercises(data);
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setFetching(false);
  };

  const getNutritionsData = async (options = {}) => {
    try {
      setFetching(true);
      options.title = buttonFilters;
      options = _.pickBy(options, _.identity);
      const response = await getNutritions(options);
      const data = _.map(response.data, (row) => ({
        ...row,
        type: "nutritions",
        grams: row.nutritionType === NUTRITION_TYPE.PER_100_G ? 100 : null,
        pcs: row.nutritionType === NUTRITION_TYPE.PER_UNIT ? 1 : null,
      }));
      // const filtered = _.filter(data, (row) => !_.find(selected, (sel) => sel.id === row.id));
      setNutritions(data);
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }

    setFetching(false);
  };

  const handleClearSelected = () => {
    getExercisesData();
    getNutritionsData();
    setSelected([]);
  };

  const handleSubmit = async () => {
    let error = false;
    if (!workout.title) {
      setError((prev) => ({ ...prev, title: true }));
      error = true;
    }

    if (!workout.description) {
      setError((prev) => ({ ...prev, description: true }));
      error = true;
    }

    if (_.isEmpty(selected)) {
      setError((prev) => ({ ...prev, selected: true }));
      error = true;
    }

    if (error) return;

    setLoading(true);
    try {
      workout.selected = selected;
      const response = await createWorkout(workout);
      navigate(`/workouts/${useTitleCase(response.data.title)}`);
    } catch (error) {
      if (error?.response?.data?.message === "501") {
        setError((prev) => ({ ...prev, "unique-title": true }));
        setLoading(false);
        return;
      }
      setToast(
        dispatch,
        <Notification
          type="error"
          title="Something went wrong!"
          content={error?.response?.data?.message || error?.message}
        />
      );
    }
    setLoading(false);
  };

  const handleWorkoutChange = (e) => {
    const { value, name } = e.target;
    setWorkout((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: !value }));
  };

  const handleTabChange = (_, value) => {
    setSelectedTab(value);
    setButtonFilters([]);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const onDragEnd = (result) => {
    setDragging(false);
    setHoveredPlace(null);
    if (!result.destination) return;

    let selectedItems = _.cloneDeep(selected);

    const draggable = result.draggableId.split(":");
    const draggableId = draggable[1];

    const source = result.source.droppableId?.split("-");
    const from = source?.[0];
    const fromPlacement = source?.[1];

    const destination = result.destination.droppableId?.split("-");
    const to = destination?.[0];
    const toPlacement = destination?.[1];

    if (
      to !== TYPES.EXERCISES &&
      to !== TYPES.NUTRITIONS &&
      (from === TYPES.EXERCISES || from === TYPES.NUTRITIONS)
    ) {
      // --------------- when dragged from nutritions or exercises into the canvas
      const draggedItem =
        _.find(exercises, (row) => row.id === draggableId) ||
        _.find(nutritions, (row) => row.id === draggableId);

      if (_.isEmpty(selected)) {
        selectedItems.push(draggedItem);
        // setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
        // setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
      } else if (+result.destination.droppableId > selectedItems.length) {
        selectedItems.push(draggedItem);
        // setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
        // setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
      } else {
        const replacedItem = selectedItems[+to - 1];
        if (from === TYPES.NUTRITIONS) {
          if (replacedItem.type === TYPES.NUTRITIONS) {
            // setNutritions((prev) => [
            //   ..._.filter(prev, (row) => row.id !== draggedItem.id),
            //   replacedItem,
            // ]);
          } else {
            // setExercises((prev) => [
            //   ..._.filter(prev, (row) => row.id !== draggedItem.id),
            //   replacedItem,
            // ]);
            // setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
          }
        } else {
          if (replacedItem.type === TYPES.EXERCISES) {
            // setExercises((prev) => [
            //   ..._.filter(prev, (row) => row.id !== draggedItem.id),
            //   replacedItem,
            // ]);
          } else {
            // setNutritions((prev) => [
            //   ..._.filter(prev, (row) => row.id !== draggedItem.id),
            //   replacedItem,
            // ]);
            // setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
          }
        }
        selectedItems[+to - 1] = draggedItem;
      }
    } else if (!fromPlacement && !toPlacement && !!selectedItems[+to - 1]) {
      // --------------- when selected items are re-arranged
      const item = selectedItems[+to - 1];
      selectedItems[+to - 1] = selectedItems[+from - 1];
      selectedItems[+from - 1] = item;
    } else if (!fromPlacement && (to === TYPES.EXERCISES || to === TYPES.NUTRITIONS)) {
      // --------------- when dragged from selected to exercises or nutritions
      // const draggedItem = _.find(
      //   selectedItems,
      //   (row, index) => `${index}:${row.id}` === result.draggableId
      // );

      // if (draggedItem.type === TYPES.EXERCISES && to === TYPES.EXERCISES) {
      //   // setExercises((prev) => [draggedItem, ...prev]);
      //   selectedItems = selectedItems.filter((row, index) => `${index}:${row.id}` !== result.draggableId);
      // }
      // if (draggedItem.type === TYPES.NUTRITIONS && to === TYPES.NUTRITIONS) {
      //   // setNutritions((prev) => [draggedItem, ...prev]);
      //   selectedItems = selectedItems.filter((row, index) => `${index}:${row.id}` !== result.draggableId);
      // }

      selectedItems = selectedItems.filter(
        (row, index) => `${index}:${row.id}` !== result.draggableId
      );
    }

    setSelected(selectedItems);
  };

  const onDragUpdate = (result) => {
    setDragging(true);
    if (!result.destination) {
      setHoveredPlace(null);
      return;
    }
    setHoveredPlace(result.destination?.droppableId);
  };

  const editItem = (data) => {
    setEditData(data);
    setShowEditModal(true);
  };

  const removeItem = (index) => {
    // const item = _.find(selected, (row) => row.id === id);
    const selecteds = _.filter(selected, (_, i) => i !== index);
    // if (item.type === TYPES.EXERCISES) {
    //   // setExercises((prev) => [item, ...prev]);
    // }
    // if (item.type === TYPES.NUTRITIONS) {
    //   // setNutritions((prev) => [item, ...prev]);
    // }
    setSelected(selecteds);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setEditData({});
  };

  const handleEdit = (values) => {
    const selecteds = _.map(selected, (row) => (row.id === values.id ? values : row));
    setSelected(selecteds);
    handleClose();
  };

  const handleDisciplineFilter = (event) => {
    const { name } = event.target;

    let discFilters = [...buttonFilters];
    if (_.includes(discFilters, name)) {
      discFilters = _.filter(discFilters, (d) => d !== name);
    } else {
      discFilters.push(name);
    }

    setButtonFilters(discFilters);
  };

  return (
    <BasicLayout>
      {loading && (
        <div className="fixed bg-black/20 top-0 right-0 bottom-0 left-0 flex items-center justify-center h-full w-full z-50">
          <MDBox
            width="auto"
            px={4}
            pb={4}
            pt={3}
            variant="gradient"
            bgColor="white"
            borderRadius="lg"
            coloredShadow="primary"
          >
            <Typography
              variant="h3"
              color="primary"
              className="flex items-center justify-center gap-2"
            >
              <div className="loader"></div>Creating Workout
            </Typography>
          </MDBox>
        </div>
      )}
      <EditForm open={showEditModal} onClose={handleClose} data={editData} onSubmit={handleEdit} />
      <div className="container mx-auto">
        <Grid container spacing={2}>
          <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            {/* --------------- Selected Exercises & Nutritions */}
            <Grid item xs={8}>
              <div className="flex flex-col gap-4">
                <Grid container spacing={4}>
                  <Grid item xs={9}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-start items-center gap-4 h-[40px]">
                        {titleEdit ? (
                          <Input
                            name="title"
                            className="w-full"
                            style={{ fontSize: 30 }}
                            placeholder="Workout Title"
                            value={workout.title}
                            onChange={handleWorkoutChange}
                            autoFocus
                            onBlur={() => setTitleEdit(false)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <h1
                              className="cursor-pointer hover:text-indigo-700/60 transition duration-300 ease-in-out font-[700] text-[30px]"
                              onClick={() => setTitleEdit(true)}
                            >
                              {workout.title || (
                                <span>
                                  Untitled Workout <span className="text-lg">(Click to edit)</span>
                                </span>
                              )}
                            </h1>
                            {error.title && (
                              <div className="text-red-400 text-sm">Title is required!</div>
                            )}
                            {error["unique-title"] && (
                              <div className="text-red-400 text-sm">
                                Workout already exists. Please enter a unique title.
                              </div>
                            )}
                          </div>
                        )}
                        {titleEdit ? (
                          <Typography
                            variant="b"
                            className="text-sm text-indigo-700 cursor-pointer font-[500]"
                            onClick={() => setTitleEdit(false)}
                          >
                            Done
                          </Typography>
                        ) : (
                          <Typography
                            variant="b"
                            className="text-sm text-indigo-700 cursor-pointer font-[500]"
                            onClick={() => setTitleEdit(true)}
                          >
                            Edit
                          </Typography>
                        )}
                      </div>
                      <div className="flex justify-start items-center gap-4 h-[40px]">
                        {descEdit ? (
                          <Input
                            multiline
                            name="description"
                            className="w-full"
                            style={{ fontSize: 18 }}
                            placeholder="Workout Description"
                            value={workout.description}
                            onChange={handleWorkoutChange}
                            autoFocus
                            onBlur={() => setDescEdit(false)}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            className="cursor-pointer hover:text-indigo-700/60 transition duration-300 ease-in-out"
                            onClick={() => setDescEdit(true)}
                          >
                            {workout.description || (
                              <span className="text-xs">
                                Workout Description: Provide detailed instructions or information
                                about your workout here <span>(Click to edit)</span>
                              </span>
                            )}
                            {error.description && (
                              <div className="text-red-400 text-sm">Description is required!</div>
                            )}
                          </Typography>
                        )}
                        {descEdit ? (
                          <Typography
                            variant="b"
                            className="text-sm text-indigo-700 cursor-pointer font-[500]"
                            onClick={() => setDescEdit(false)}
                          >
                            Done
                          </Typography>
                        ) : (
                          <Typography
                            variant="b"
                            className="text-sm text-indigo-700 cursor-pointer font-[500]"
                            onClick={() => setDescEdit(true)}
                          >
                            Edit
                          </Typography>
                        )}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className="flex flex-col justify-center items-end h-full gap-2">
                      <div className="border rounded-lg border-[#7560C5] bg-white w-full flex justify-center cursor-pointer">
                        <IconButton
                          color="primary"
                          aria-label="Add"
                          onClick={handleSubmit}
                          className="flex items-center gap-1"
                        >
                          <Icon fontSize="small">send</Icon>
                          <b className="text-sm">Save & Send Workout</b>
                        </IconButton>
                      </div>
                      <div className="border rounded-lg border-[#7560C5] bg-white w-full flex justify-center cursor-pointer">
                        <IconButton
                          color="primary"
                          aria-label="Add"
                          onClick={handleClearSelected}
                          className="flex items-center gap-1"
                        >
                          <Icon fontSize="small">delete_outline</Icon>
                          <b className="text-sm">Clear Workout</b>
                        </IconButton>
                      </div>
                      {/* <Tooltip title="Save">
                        <div className="border rounded-full border-[#7560C5] bg-white">
                          <IconButton color="primary" aria-label="Add">
                            <Icon fontSize="small">save</Icon>
                          </IconButton>
                        </div>
                      </Tooltip> */}
                    </div>
                  </Grid>
                </Grid>
                <MDBox width="100%" p={4} bgColor="white" className="rounded-xl">
                  <SelectedExercises
                    error={error}
                    data={selected}
                    dragging={dragging}
                    hoveredPlace={hoveredPlace}
                    editItem={editItem}
                    removeItem={removeItem}
                  />
                </MDBox>
              </div>
            </Grid>

            {/* --------------- Exercises & Nutritions */}
            <Grid item xs={4}>
              <div className="flex flex-col gap-5 relative">
                <div
                  style={{
                    position: isScrolled ? "fixed" : null,
                    zIndex: isScrolled ? 40 : null,
                    top: isScrolled ? 73 : null,
                  }}
                >
                  <MDBox
                    width="100%"
                    px={isScrolled ? 1 : 2}
                    pb={1}
                    pt={1}
                    variant="gradient"
                    bgColor="primary"
                    borderRadius="lg"
                    coloredShadow="primary"
                    className="flex flex-col gap-2"
                  >
                    <Input
                      style={{ color: "white", width: "100%", fontSize: 18 }}
                      placeholder="Search by Name, Muscle or Fitness disciplines"
                      color="secondary"
                      value={search}
                      onChange={handleSearchChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon className="text-white">search</Icon>
                        </InputAdornment>
                      }
                    />
                    <div className="grid grid-cols-4 items-center gap-2">
                      {selectedTab === TABS.EXERCISES &&
                        BUTTON_EXERCISE_FILTERS.map((filter) => (
                          <MDButton
                            size="small"
                            variant={buttonFilters.includes(filter) ? "contained" : "text"}
                            color="white"
                            name={filter}
                            onClick={handleDisciplineFilter}
                          >
                            {filter}
                          </MDButton>
                        ))}

                      {selectedTab === TABS.NUTRITIONS &&
                        BUTTON_NUTRITION_FILTERS.map((filter) => (
                          <MDButton
                            size="small"
                            variant={buttonFilters.includes(filter) ? "contained" : "text"}
                            color="white"
                            name={filter}
                            onClick={handleDisciplineFilter}
                          >
                            {filter}
                          </MDButton>
                        ))}
                    </div>
                  </MDBox>
                </div>
                <MDBox
                  width="100%"
                  p={2}
                  bgColor="white"
                  className="rounded-xl"
                  mt={isScrolled ? 14 : 0}
                >
                  <AppBar position="static" className="mb-2">
                    <Tabs orientation="horizontal" value={selectedTab} onChange={handleTabChange}>
                      <Tab label="Exercises" />
                      <Tab label="Nutritions" />
                    </Tabs>
                  </AppBar>
                  <div className={`overflow-y-auto max-h-[795px] pb-2`}>
                    {selectedTab === TABS.EXERCISES && (
                      <ExercisesList
                        fetching={fetching}
                        data={exercises}
                        hoveredPlace={hoveredPlace}
                      />
                    )}
                    {selectedTab === TABS.NUTRITIONS && (
                      <NutritionsList
                        fetching={fetching}
                        data={nutritions}
                        hoveredPlace={hoveredPlace}
                      />
                    )}
                  </div>
                </MDBox>
              </div>
            </Grid>
          </DragDropContext>
        </Grid>
      </div>
    </BasicLayout>
  );
};

export default WorkoutBuilder;
