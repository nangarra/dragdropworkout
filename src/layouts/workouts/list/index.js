import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import dayjs from "dayjs";
import DataTable from "examples/Tables/DataTable";
import { useTitleCase } from "hooks";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { getWorkouts } from "services/workouts";

const Loader = ({ loading, children }) => {
  if (loading) {
    return (
      <>
        <div className="grid justify-center items-center absolute z-30 top-0 right-0 left-0 bottom-0 w-full h-full">
          <div className="loader-lg"></div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
};

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("popular");

  useEffect(() => {
    getWorkoutsData();
  }, [filter]);

  const getWorkoutsData = async () => {
    setLoading(true);
    const response = await getWorkouts({ sort: filter });
    const data = setData(response.data);
    setWorkouts(data);
    setLoading(false);
  };

  const changeFilter = (value) => {
    setFilter(value);
  };

  const setData = (data = []) => {
    return _.map(data, (row) => ({
      ...row,
      title: (
        <NavLink
          to={`/workouts/${useTitleCase(row.title)}`}
          className="hover:text-purple-600 transition duration-300 ease-in-out"
        >
          <b>{row.title}</b>
        </NavLink>
      ),
      description: <MDTypography variant="caption">{row.description}</MDTypography>,
      exercises: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {row.SelectedExercise?.length}
        </MDTypography>
      ),
      createdBy: row.User ? row.User?.username : "Anonymous",
      ratingHtml: (
        <StarRatings
          starDimension="20px"
          starSpacing="2px"
          rating={Number(row.rating || 0)}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
        />
      ),
      createdAt: dayjs(row.createdAt).format("MM/DD/YYYY"),
    }));
  };

  const cols = [
    { Header: "title", accessor: "title", width: "30%", align: "left" },
    { Header: "description", accessor: "description", align: "left" },
    { Header: "total exercises", accessor: "exercises", align: "left" },
    { Header: "rating", accessor: "ratingHtml", align: "left" },
    { Header: "created", accessor: "createdAt", align: "left" },
    { Header: "created by", accessor: "createdBy", align: "left" },
  ];

  const columnHeaders = _.map(cols, "Header");
  const columns = useMemo(() => cols, columnHeaders);

  return (
    <div className="container flex flex-col gap-4 py-4 mt-6">
      <Card>
        <MDBox
          mx={2}
          mt={-3}
          py={3}
          px={2}
          variant="gradient"
          bgColor="primary"
          borderRadius="lg"
          coloredShadow="primary"
        >
          <MDTypography variant="h6" color="white">
            Workout Listings
          </MDTypography>
        </MDBox>
        <MDBox pt={3}>
          <Grid container spacing={2} className="p-4">
            <Grid item xl={1.2}>
              <MDButton
                className="w-full"
                size="large"
                variant={filter === "popular" ? "gradient" : "outlined"}
                color="primary"
                onClick={() => changeFilter("popular")}
              >
                Populer
              </MDButton>
            </Grid>
            <Grid item xl={1.2}>
              <MDButton
                className="w-full"
                size="large"
                variant={filter === "recent" ? "gradient" : "outlined"}
                color="primary"
                onClick={() => changeFilter("recent")}
              >
                Recent
              </MDButton>
            </Grid>
            <Grid item xl={1.2}>
              <MDButton
                className="w-full"
                size="large"
                variant={filter === "old" ? "gradient" : "outlined"}
                color="primary"
                onClick={() => changeFilter("old")}
              >
                Old
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <div className="min-h-[700px]">
        <Card>
          <Loader loading={loading}>
            <MDBox>
              <DataTable
                table={{ columns, rows: workouts }}
                isSorted={false}
                entriesPerPage={{ defaultValue: 10, entries: [10, 25, 50, 100] }}
                showTotalEntries
                noEndBorder
              />
            </MDBox>
          </Loader>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutList;
