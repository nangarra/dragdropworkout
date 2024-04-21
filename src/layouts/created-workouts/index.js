import { Icon, IconButton, Paper, Typography } from "@mui/material";
import classNames from "classnames";
import Loading from "components/Loading";
import { NUTRITION_TYPE } from "constants";
import { AnimatePresence, motion } from "framer-motion";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { getWorkout, setWorkoutRating } from "services/workouts";
import Loader from "./loader";
import _ from "lodash";
const MY_WORKOUT_RATINGS = "MY_WORKOUT_RATINGS";

const CreatedWorkouts = () => {
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState({});
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [confirming, setConfirming] = useState(false);

  const { workout: workoutId } = useParams();

  useEffect(() => {
    if (workoutId) {
      getWorkoutData();
    }
    const myRatings = JSON.parse(localStorage.getItem(MY_WORKOUT_RATINGS));
    if (myRatings && myRatings[workoutId]) {
      setRating(myRatings[workoutId]);
    }
  }, []);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  }, [message]);

  const getWorkoutData = async () => {
    setLoading(true);
    const response = await getWorkout(workoutId);
    setWorkout(response.data);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const copyToClipboard = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    setMessage("Copied to clipboard!");
  };

  const onClose = () => {
    setOpen(false);
    setRating(0);
  };

  const onOpen = () => {
    if (!rating) {
      setOpen(true);
    }
  };

  const onConfirmRating = async (value) => {
    setConfirming(true);
    const response = await setWorkoutRating(workout.id, value);
    let myRatings = JSON.parse(localStorage.getItem(MY_WORKOUT_RATINGS));
    if (!myRatings) {
      myRatings = {};
    }
    myRatings[workoutId] = value;
    localStorage.setItem(MY_WORKOUT_RATINGS, JSON.stringify(myRatings));
    setOpen(false);
    setConfirming(false);
    getWorkoutData();
  };

  const changeRating = (value) => {
    setRating(value);
    onConfirmRating(value);
  };

  return (
    <BasicLayout>
      <Loading loading={loading} customLoader={<Loader />}>
        <div className="flex flex-col gap-8 p-2">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <Typography variant="h3">{workout.title}</Typography>
              <div className="flex justify-end items-center gap-2">
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center bg-[#7560C5] rounded-lg text-white p-2 text-xs min-w-[125px]"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="border rounded-lg border-[#7560C5] bg-white w-full flex justify-center cursor-pointer">
                  <IconButton color="primary" aria-label="Add" onClick={copyToClipboard}>
                    <Icon fontSize="small">copy</Icon>
                    <b className="text-sm">Copy URL</b>
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="flex items-center h-full text-[30px]">
                  <Icon className="text-amber-300">star</Icon>
                </span>
                <h3>{workout.rating ? Number(workout.rating).toFixed(1) : workout.rating}/5</h3>
                <span className="text-sm text-gray-400">{workout.ratingsCount}</span>
              </div>

              <div
                className={classNames(
                  "flex items-center text-[#7560C5] cursor-pointer text-[15px]",
                  rating ? "gap-2" : "gap-1"
                )}
              >
                <span className="flex items-center h-full text-[20px] gap-2">
                  {rating ? (
                    <>
                      <div className="flex items-center h-full gap-1">
                        <span className="flex items-center h-full text-[20px] pb-1">
                          <Icon>star</Icon>
                        </span>
                        <h3>{Number(rating)}/5</h3>
                      </div>
                      <span className="text-sm">Your Rating</span>
                    </>
                  ) : (
                    <StarRatings
                      rating={rating}
                      changeRating={changeRating}
                      starDimension="30px"
                      starSpacing="2px"
                      starRatedColor="gold"
                      starHoverColor="#7560C5"
                      numberOfStars={5}
                      name="rating"
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
          <Typography variant="body">{workout.description}</Typography>
          {workout.SelectedExercise?.map((row) => {
            const item = row.Exercise || row.Nutrition;
            return (
              <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.05 }}>
                <Paper className="grid sm:grid-cols-3 justify-center max-w-[600px]">
                  <div className="flex sm:w-fit justify-center">
                    <img src={item.thumbnail} className="w-[200px] h-[200px] object-cover" />
                  </div>
                  <div className="flex flex-col gap-2 p-4 w-full sm:col-span-2">
                    <Typography variant="h4" className="text-center">
                      {item.title}
                    </Typography>
                    <Typography variant="caption">{item.description}</Typography>
                    {row.Exercise && (
                      <div className="grid grid-cols-2 text-xs justify-center h-full">
                        <div className="flex items-center justify-center gap-2 p-2">
                          <b className="text-[25px]">
                            {row.sets
                              ? Number(row.sets).toLocaleString("en-US", {
                                  minimumIntegerDigits: 2,
                                })
                              : "--"}
                          </b>
                          <span className="text-[15px]">Sets</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2">
                          <b className="text-[25px]">
                            {row.repititions
                              ? Number(row.repititions).toLocaleString("en-US", {
                                  minimumIntegerDigits: 2,
                                })
                              : "--"}
                          </b>
                          <span className="text-[15px]">Reps</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2">
                          <span className="flex items-center">
                            <b className="text-[25px]">
                              {row.minutes
                                ? Number(row.minutes).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                  })
                                : "00"}
                            </b>
                            <h5>:</h5>&nbsp;
                            <b className="text-[25px]">
                              {row.seconds
                                ? Number(row.seconds).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                  })
                                : "00"}
                            </b>
                          </span>
                          <span className="text-[15px]">Rest</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2">
                          <b className="text-[25px]">
                            {row.weight
                              ? Number(row.weight).toLocaleString("en-US", {
                                  minimumIntegerDigits: 2,
                                })
                              : "--"}
                          </b>
                          <span className="text-[15px]">KG</span>
                        </div>
                      </div>
                    )}
                    {row.Nutrition && (
                      <div className="grid grid-cols-2 text-xs justify-center h-full">
                        <div className="flex items-center justify-center gap-2 p-2">
                          <b className="text-[25px]">{row.calories || "--"}</b>{" "}
                          <span className="text-[15px]">g</span>{" "}
                          <span className="text-[15px]">Calories</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2">
                          <b className="text-[25px]">{row.fat || "--"}</b>{" "}
                          <span className="text-[15px]">g</span>{" "}
                          <span className="text-[15px]">Fat</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-2">
                          <b className="text-[25px]">{row.protein || "--"}</b>{" "}
                          <span className="text-[15px]">g</span>{" "}
                          <span className="text-[15px]">Protein</span>
                        </div>
                        {row.Nutrition?.nutritionType === NUTRITION_TYPE.PER_UNIT ? (
                          <div className="flex items-center justify-center gap-2 p-2">
                            <b className="text-[25px]">{row.pcs || "--"}</b>{" "}
                            <span className="text-[15px]">pcs</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 p-2">
                            <b className="text-[25px]">{row.grams || "--"}</b>{" "}
                            <span className="text-[15px]">g</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Paper>
              </motion.div>
            );
          })}
        </div>
      </Loading>
    </BasicLayout>
  );
};

export default CreatedWorkouts;
