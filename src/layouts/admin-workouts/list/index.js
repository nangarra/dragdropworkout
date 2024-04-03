import { Card, Grid, Icon, Input, Skeleton } from "@mui/material";
import Loading from "components/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import dayjs from "dayjs";
import DataTable from "examples/Tables/DataTable";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import StarRatings from "react-star-ratings";

const getWorkouts = async () => {
  const data = [
    {
      title: "Best Biceps workout ever",
      description: "Curl dumbbells with a slow squeeze to target your biceps for maximum growth.",
      rating: 5,
      exercises: 5,
      createdAt: dayjs("02-03-2024").toDate(),
    },
    {
      title: "Best Upper body chest workout ever",
      description:
        "Bench press variations to hit all areas of your chest for a well-rounded physique.",
      rating: 4.5,
      exercises: 7,
      createdAt: dayjs("05-23-2024").toDate(),
    },
    {
      title: "Thighs workout you would die for",
      description:
        "Compound squats and lunges to build strong, toned legs and a powerful lower body.",
      rating: 4,
      exercises: 6,
      createdAt: dayjs("07-15-2024").toDate(),
    },
  ];
  return { data };
};

const Loader = () => (
  <MDBox pt={3}>
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-6 gap-4">
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full col-span-2" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
      </div>
      <hr className="w-full" />
      <div className="grid grid-cols-6 gap-4">
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full col-span-2" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
      </div>
      <hr className="w-full" />
      <div className="grid grid-cols-6 gap-4">
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full col-span-2" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
      </div>
      <hr className="w-full" />
      <div className="grid grid-cols-6 gap-4">
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full col-span-2" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
      </div>
      <hr className="w-full" />
      <div className="grid grid-cols-6 gap-4">
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full col-span-2" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
      </div>
    </div>
  </MDBox>
);

const WorkoutList = (props) => {
  const { getData } = props;
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("popular");

  useEffect(() => {
    getWorkoutsData();
  }, []);

  useEffect(() => {
    if (getData) {
      getWorkoutsData();
    }
  }, [getData]);

  const getWorkoutsData = async () => {
    setLoading(true);
    const response = await getWorkouts();
    const data = setData(response.data);
    setWorkouts(_.orderBy(data, ["rating"], ["desc"]));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const changeFilter = (value) => {
    setFilter(value);
    switch (value) {
      case "popular": {
        setWorkouts(_.orderBy(workouts, ["rating"], ["desc"]));
        break;
      }
      case "recent": {
        setWorkouts(_.orderBy(workouts, ["createdAt"], ["desc"]));
        break;
      }
      case "old": {
        setWorkouts(_.orderBy(workouts, ["createdAt"], ["asc"]));
        break;
      }
      default: {
        setWorkouts(_.orderBy(workouts, ["rating"], ["desc"]));
        break;
      }
    }
  };

  const setData = (data = []) => {
    return _.map(data, (row) => ({
      ...row,
      title: (
        <MDTypography display="block" variant="button" fontWeight="medium" lineHeight={1}>
          {row.title}
        </MDTypography>
      ),
      description: <MDTypography variant="caption">{row.description}</MDTypography>,
      exercises: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {row.exercises}
        </MDTypography>
      ),
      ratingHtml: (
        <StarRatings
          starDimension="20px"
          starSpacing="2px"
          rating={row.rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
        />
      ),
      createdAt: dayjs(row.createdAt).format("MM/DD/YYYY"),
      action: (
        <MDTypography
          component="a"
          href="#"
          color="text"
          className="text-gray-400 hover:text-red-400"
        >
          <Icon>delete_forever</Icon>
        </MDTypography>
      ),
    }));
  };

  const cols = [
    { Header: "title", accessor: "title", width: "30%", align: "left" },
    { Header: "description", accessor: "description", align: "left" },
    { Header: "total exercises", accessor: "exercises", align: "left" },
    { Header: "rating", accessor: "ratingHtml", align: "left" },
    { Header: "created", accessor: "createdAt", align: "left" },
    { Header: "action", accessor: "action", align: "left" },
  ];

  const columnHeaders = _.map(cols, "Header");
  const columns = useMemo(() => cols, columnHeaders);

  return (
    <MDBox pt={4} pb={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Loading loading={loading} customLoader={<Loader />}>
              <MDBox>
                <DataTable
                  table={{ columns, rows: workouts }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 10, entries: [10, 25, 50, 100] }}
                  showTotalEntries
                  noEndBorder
                />
              </MDBox>
            </Loading>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default WorkoutList;
