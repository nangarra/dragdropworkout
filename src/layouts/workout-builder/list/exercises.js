import { Paper, Skeleton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import _ from "lodash";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Loader = () => (
  <>
    <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
    <Skeleton variant="rectangular" className="rounded-md w-full" height={200} />
  </>
);

const ExercisesList = (props) => {
  const { data = [], hoveredPlace, fetching } = props;
  const evens = data.filter((_, index) => index % 2 === 0);
  const odds = data.filter((_, index) => index % 2 !== 0);

  const [hover, setHover] = useState(null);
  return (
    <div className="grid grid-cols-2 gap-2">
      {_.isEmpty(data) && !fetching && (
        <Droppable droppableId="exercises-empty">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid justify-center items-center h-[200px] border rounded-lg transition duration-300 ease-in-out ${
                hoveredPlace === "exercises-empty" ? "bg-gray-100" : ""
              }`}
            >
              No more Exercises
            </ul>
          )}
        </Droppable>
      )}
      {fetching ? (
        <Loader />
      ) : (
        <>
          <Droppable droppableId="exercises-even">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2"
              >
                {evens.map((row, index) => (
                  <Draggable
                    index={index}
                    key={`exercises:${row.id}`}
                    draggableId={`exercises:${row.id}`}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Paper
                          variant="outlined"
                          className="cursor-drag hover:shadow-md relative overflow-hidden"
                          style={{ borderRadius: 8 }}
                          onMouseEnter={() => setHover(row.id)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <div className="flex justify-center items-center h-[150px] overflow-hidden border-b border-gray-300">
                            <img
                              src={row.thumbnail || "/img/no-image.png"}
                              className={`w-1/2 h-fit object-cover ${
                                row.thumbnail ? "" : "opacity-50"
                              }`}
                            />
                          </div>
                          <div className="py-2 px-4">
                            <Typography
                              gutterBottom
                              variant="p"
                              component="div"
                              className="flex flex-col text-sm font-semibold"
                            >
                              <span>{row.title}</span>

                              <div className="flex flex-wrap gap-1">
                                {row.discipline.map((dis) => (
                                  <span className="text-xs text-gray-400 font-normal border border-gray-400 rounded-full px-2">
                                    {dis}
                                  </span>
                                ))}
                              </div>
                            </Typography>

                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: hover === row.id ? "auto" : 0 }}
                              className="overflow-hidden"
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.description}
                              </Typography>
                            </motion.div>
                          </div>
                        </Paper>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <Droppable droppableId="exercises-odd">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2"
              >
                {odds.map((row, index) => (
                  <Draggable
                    index={index}
                    key={`exercises:${row.id}`}
                    draggableId={`exercises:${row.id}`}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Paper
                          variant="outlined"
                          className="cursor-drag hover:shadow-md relative overflow-hidden"
                          style={{ borderRadius: 8 }}
                          onMouseEnter={() => setHover(row.id)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <div className="flex justify-center items-center h-[150px] overflow-hidden border-b border-gray-300">
                            <img
                              src={row.thumbnail || "/img/no-image.png"}
                              className={`w-1/2 h-fit object-cover ${
                                row.thumbnail ? "" : "opacity-50"
                              }`}
                            />
                          </div>
                          <div className="py-2 px-4">
                            <Typography
                              gutterBottom
                              variant="p"
                              component="div"
                              className="flex flex-col text-sm font-semibold"
                            >
                              <span>{row.title}</span>
                              <div className="flex flex-wrap gap-1">
                                {row.discipline.map((dis) => (
                                  <span className="text-xs text-gray-400 font-normal border border-gray-400 rounded-full px-2">
                                    {dis}
                                  </span>
                                ))}
                              </div>
                            </Typography>

                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: hover === row.id ? "auto" : 0 }}
                              className="overflow-hidden"
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.description}
                              </Typography>
                            </motion.div>
                          </div>
                        </Paper>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </>
      )}
    </div>
  );
};

export default ExercisesList;
