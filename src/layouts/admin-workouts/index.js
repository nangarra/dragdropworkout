import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import WorkoutList from "./list";

const Workouts = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <WorkoutList />
      <Footer />
    </DashboardLayout>
  );
};

export default Workouts;
