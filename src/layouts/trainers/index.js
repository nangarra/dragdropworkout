import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import TrainerList from "./list";

const Clients = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TrainerList />
      <Footer />
    </DashboardLayout>
  );
};

export default Clients;
