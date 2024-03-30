// Material Home 2 React example components
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Home components
import { useEffect, useState } from "react";
import NutritionForm from "./form";
import NutritionList from "./list";
import Filters from "./list/filters";

const Nutritions = () => {
  const [openNutritionForm, setOpenNutritionForm] = useState(false);
  const [selectedNutrition, setSelectedNutrition] = useState({});
  const [getData, setGetData] = useState(false);

  useEffect(() => {
    if (getData) {
      setTimeout(() => {
        setGetData(false);
      }, 300);
    }
  }, [getData]);

  const handleOpenNutritionForm = (nutrition) => {
    setOpenNutritionForm(true);
    if (nutrition) {
      setSelectedNutrition(nutrition);
    }
  };

  const closeNutritionForm = () => {
    setOpenNutritionForm(false);
    setGetData(true);
    setSelectedNutrition({});
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onAddNew={handleOpenNutritionForm} />
      <NutritionForm
        open={openNutritionForm}
        nutrition={selectedNutrition}
        onClose={closeNutritionForm}
      />
      <Filters />
      <NutritionList getData={getData} onOpen={handleOpenNutritionForm} />
      <Footer />
    </DashboardLayout>
  );
};

export default Nutritions;
