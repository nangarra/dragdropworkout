import { Card, Grid, Icon, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import Confirmation from "components/Confirmation";
import Loading from "components/Loading";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNutritions, deleteNutrition } from "services/nutritions";

const Loader = () => (
  <>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <Skeleton variant="rectangular" className="rounded-xl w-full" height={280} />
    </Grid>
  </>
);

const NoNutritions = ({ onOpen }) => (
  <Grid item xs={12} md={6} lg={3}>
    <Paper
      variant="outlined"
      className="rounded-xl w-full h-[280px] p-4 flex flex-col items-center justify-center gap-4"
    >
      <div className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-lg p-8">
        <Typography>Add Nutritions Now!</Typography>
        <MDButton size="small" variant="gradient" color="primary" onClick={onOpen}>
          <Icon>add</Icon>&nbsp;Add New
        </MDButton>
      </div>
    </Paper>
  </Grid>
);

const NutritionList = (props) => {
  const { onOpen, getData } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nutritions, setNutritions] = useState([]);
  const [noNutritions, setNoNutritions] = useState(false);
  const [hover, setHover] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleteNutritionId, setDeleteNutritionId] = useState(null);

  useEffect(() => {
    getNutritionsData();
  }, []);

  useEffect(() => {
    if (getData) {
      getNutritionsData();
    }
  }, [getData]);

  const getNutritionsData = async () => {
    setLoading(true);
    const response = await getNutritions();
    setNoNutritions(_.isEmpty(response.data));
    setNutritions(response.data);
    setLoading(false);
  };

  const gotoNutritions = (id) => {
    navigate(`/nutritions/${id}`);
  };

  const editNutrition = (nutrition) => {
    onOpen(nutrition);
  };

  const confirmDeleteNutrition = (id) => {
    setConfirm(true);
    setDeleteNutritionId(id);
  };

  const closeConfirmDeleteNutrition = () => {
    setConfirm(false);
    setDeleteNutritionId(null);
  };

  const deleteNutritionConfirmed = async () => {
    const response = await deleteNutrition(deleteNutritionId);

    closeConfirmDeleteNutrition();
    getNutritionsData();
  };

  return (
    <MDBox py={3}>
      <Confirmation
        open={confirm}
        title="Delete Nutrition"
        message="Are you sure you want to delete this nutrition?"
        onClose={closeConfirmDeleteNutrition}
        onConfirm={deleteNutritionConfirmed}
      />
      <Grid container spacing={3}>
        <Loading loading={loading} customLoader={<Loader />}>
          {noNutritions && <NoNutritions onOpen={onOpen} />}
          {nutritions.map((row) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={row.id}
              onMouseLeave={() => setHover(null)}
              onMouseEnter={() => setHover(row.id)}
            >
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Paper variant="outlined" className="cursor-pointer hover:shadow-md">
                  <div
                    onClick={() => gotoNutritions(row.id)}
                    className="flex justify-center p-4 h-[120px] border-b border-gray-300"
                  >
                    <img
                      src={row.thumbnail || "/img/no-image.png"}
                      className={`h-full w-fit ${row.thumbnail ? "" : "opacity-50"}`}
                    />
                  </div>
                  <div className="p-4">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="flex items-center justify-between"
                    >
                      <span>{row.title}</span>
                      <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                          <Icon
                            onClick={() => editNutrition(row)}
                            className="text-gray-400 hover:text-blue-400"
                          >
                            edit
                          </Icon>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Icon
                            onClick={() => confirmDeleteNutrition(row.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            delete_forever
                          </Icon>
                        </Tooltip>
                      </div>
                    </Typography>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: hover === row.id ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {row.description}
                      </Typography>
                    </motion.div>
                  </div>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Loading>
      </Grid>
    </MDBox>
  );
};

export default NutritionList;
