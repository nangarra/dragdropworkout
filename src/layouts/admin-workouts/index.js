import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import WorkoutList from "./list";

const Workouts = () => {
  const [getData, setGetData] = useState(false);

  useEffect(() => {
    if (getData) {
      setTimeout(() => {
        setGetData(false);
      }, 300);
    }
  }, [getData]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <WorkoutList getData={getData} />
      <Footer />
    </DashboardLayout>
  );
};

export default Workouts;
