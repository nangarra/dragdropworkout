import { useEffect, useState } from "react";
import WorkoutList from "./list";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import MDBox from "components/MDBox";

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
    <BasicLayout>
      <WorkoutList getData={getData} />
    </BasicLayout>
  );
};

export default Workouts;
