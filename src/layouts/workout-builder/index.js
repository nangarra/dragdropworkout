import {
  AppBar,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Notification from "components/Notification";
import { setToast, useMaterialUIController } from "context";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import _ from "lodash";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { getExercises } from "services/exercises";
import { getNutritions } from "services/nutritions";
import EditForm from "./form";
import ExercisesList from "./list/exercises";
import NutritionsList from "./list/nutritions";
import SelectedExercises from "./list/selectedExercises";
import { createWorkout } from "services/workouts";
import { useNavigate } from "react-router-dom";

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

const WorkoutBuilder = () => {
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

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
  }, [search]);

  useEffect(() => {
    if (workout.title) {
      setError(null);
    }
  }, [titleEdit]);

  useEffect(() => {
    if (!_.isEmpty(selected)) {
      setError(null);
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
      options = _.pickBy(options, _.identity);
      const response = await getExercises(options);
      const data = _.map(response.data, (row) => ({ ...row, type: "exercises" }));
      const filtered = _.filter(data, (row) => !_.find(selected, (sel) => sel.id === row.id));
      setExercises(filtered);
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
  };

  const getNutritionsData = async (options = {}) => {
    try {
      options = _.pickBy(options, _.identity);
      const response = await getNutritions(options);
      const data = _.map(response.data, (row) => ({ ...row, type: "nutritions" }));
      const filtered = _.filter(data, (row) => !_.find(selected, (sel) => sel.id === row.id));
      setNutritions(filtered);
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
  };

  const handleClearSelected = () => {
    getExercisesData();
    getNutritionsData();
    setSelected([]);
  };

  const handleSubmit = async () => {
    if (!workout.title) {
      setError("title");
      return;
    }
    if (_.isEmpty(selected)) {
      setError("selected");
      return;
    }
    setLoading(true);
    try {
      workout.selected = selected;
      const response = await createWorkout(workout);
      navigate(`/workouts/${response.data.id}`);
    } catch (error) {
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
  };

  const handleTabChange = (_, value) => {
    setSelectedTab(value);
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
      const draggedItem =
        _.find(exercises, (row) => row.id === result.draggableId) ||
        _.find(nutritions, (row) => row.id === result.draggableId);

      if (_.isEmpty(selected)) {
        selectedItems.push(draggedItem);
        setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
        setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
      } else if (+result.destination.droppableId > selectedItems.length) {
        selectedItems.push(draggedItem);
        setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
        setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
      } else {
        const replacedItem = selectedItems[+to - 1];
        if (from === TYPES.NUTRITIONS) {
          if (replacedItem.type === TYPES.NUTRITIONS) {
            setNutritions((prev) => [
              ..._.filter(prev, (row) => row.id !== draggedItem.id),
              replacedItem,
            ]);
          } else {
            setExercises((prev) => [
              ..._.filter(prev, (row) => row.id !== draggedItem.id),
              replacedItem,
            ]);
            setNutritions((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
          }
        } else {
          if (replacedItem.type === TYPES.EXERCISES) {
            setExercises((prev) => [
              ..._.filter(prev, (row) => row.id !== draggedItem.id),
              replacedItem,
            ]);
          } else {
            setNutritions((prev) => [
              ..._.filter(prev, (row) => row.id !== draggedItem.id),
              replacedItem,
            ]);
            setExercises((prev) => _.filter(prev, (row) => row.id !== draggedItem.id));
          }
        }
        selectedItems[+to - 1] = draggedItem;
      }
    } else if (!fromPlacement && !toPlacement && !!selectedItems[+to - 1]) {
      const item = selectedItems[+to - 1];
      selectedItems[+to - 1] = selectedItems[+from - 1];
      selectedItems[+from - 1] = item;
    } else if (!fromPlacement && (to === TYPES.EXERCISES || to === TYPES.NUTRITIONS)) {
      const draggedItem = _.find(selectedItems, (row) => row.id === result.draggableId);

      if (draggedItem.type === TYPES.EXERCISES && to === TYPES.EXERCISES) {
        setExercises((prev) => [draggedItem, ...prev]);
        selectedItems = selectedItems.filter((row) => row.id !== draggedItem.id);
      }
      if (draggedItem.type === TYPES.NUTRITIONS && to === TYPES.NUTRITIONS) {
        setNutritions((prev) => [draggedItem, ...prev]);
        selectedItems = selectedItems.filter((row) => row.id !== draggedItem.id);
      }
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

  const removeItem = (id) => {
    const item = _.find(selected, (row) => row.id === id);
    const selecteds = _.filter(selected, (row) => row.id !== id);
    if (item.type === TYPES.EXERCISES) {
      setExercises((prev) => [item, ...prev]);
    }
    if (item.type === TYPES.NUTRITIONS) {
      setNutritions((prev) => [item, ...prev]);
    }
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
                      <div className="flex justify-between items-center gap-4 h-[40px]">
                        {titleEdit ? (
                          <Input
                            name="title"
                            className="w-full"
                            style={{ fontSize: 30 }}
                            placeholder="Workout Title"
                            value={workout.title}
                            onChange={handleWorkoutChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Typography variant="h3">{workout.title || "Workout Title"}</Typography>
                            {error === "title" && (
                              <div className="text-red-400 text-sm">Title is required!</div>
                            )}
                          </div>
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
                            placeholder="Workout Description"
                            value={workout.description}
                            onChange={handleWorkoutChange}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            className="flex justify-between items-center gap-4 h-[40px]"
                          >
                            {workout.description || "Workout Description"}
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
                      <Tooltip title="Create & Send">
                        <div className="border rounded-full border-[#7560C5] bg-white">
                          <IconButton color="primary" aria-label="Add" onClick={handleSubmit}>
                            <Icon fontSize="small">send</Icon>
                          </IconButton>
                        </div>
                      </Tooltip>
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
                    value={search}
                    onChange={handleSearchChange}
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
                  <div className={`overflow-y-auto max-h-[795px] pb-2`}>
                    {selectedTab === TABS.EXERCISES && (
                      <ExercisesList data={exercises} hoveredPlace={hoveredPlace} />
                    )}
                    {selectedTab === TABS.NUTRITIONS && (
                      <NutritionsList data={nutritions} hoveredPlace={hoveredPlace} />
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
