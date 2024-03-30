// Material Home 2 React example components
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Home components
import { useEffect, useState } from "react";
import ExerciseForm from "./form";
import ExerciseList from "./list";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Card, Grid } from "@mui/material";
import Filters from "./list/filters";

const Exercises = () => {
  const [openExerciseForm, setOpenExerciseForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState({});
  const [getData, setGetData] = useState(false);

  useEffect(() => {
    if (getData) {
      setTimeout(() => {
        setGetData(false);
      }, 300);
    }
  }, [getData]);

  const handleOpenExerciseForm = (exercise) => {
    setOpenExerciseForm(true);
    if (exercise) {
      setSelectedExercise(exercise);
    }
  };

  const closeExerciseForm = () => {
    setOpenExerciseForm(false);
    setGetData(true);
    setSelectedExercise({});
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onAddNew={handleOpenExerciseForm} />
      <ExerciseForm
        open={openExerciseForm}
        exercise={selectedExercise}
        onClose={closeExerciseForm}
      />
      <Filters />
      <ExerciseList getData={getData} onOpen={handleOpenExerciseForm} />
      <Footer />
    </DashboardLayout>
  );
};

export default Exercises;
