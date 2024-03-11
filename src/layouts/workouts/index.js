// Material Home 2 React example components
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Home components
import { useEffect, useState } from "react";
import WorkoutForm from "./form";
import WorkoutList from "./list";

const Workouts = () => {
  const [openWorkoutForm, setOpenWorkoutForm] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState({});
  const [getData, setGetData] = useState(false);

  useEffect(() => {
    if (getData) {
      setTimeout(() => {
        setGetData(false);
      }, 300);
    }
  }, [getData]);

  const handleOpenWorkoutForm = (workout) => {
    setOpenWorkoutForm(true);
    if (workout) {
      setSelectedWorkout(workout);
    }
  };

  const closeWorkoutForm = () => {
    setOpenWorkoutForm(false);
    setGetData(true);
    setSelectedWorkout({});
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onAddNew={handleOpenWorkoutForm} />
      <WorkoutForm open={openWorkoutForm} workout={selectedWorkout} onClose={closeWorkoutForm} />
      <WorkoutList getData={getData} onOpen={handleOpenWorkoutForm} />
      <Footer />
    </DashboardLayout>
  );
};

export default Workouts;
