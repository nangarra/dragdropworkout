import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ClientList from "./list";

const Clients = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ClientList />
      <Footer />
    </DashboardLayout>
  );
};

export default Clients;
