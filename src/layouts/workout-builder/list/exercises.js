import { Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const ExercisesList = (props) => {
  const { data = [] } = props;
  const evens = data.filter((_, index) => index % 2 === 0);
  const odds = data.filter((_, index) => index % 2 !== 0);

  const [hover, setHover] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Droppable droppableId="even">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
            {evens.map((row, index) => (
              <Draggable key={row.id} draggableId={row.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Paper
                      variant="outlined"
                      className="cursor-pointer hover:shadow-md relative overflow-hidden"
                      style={{ borderRadius: 8 }}
                      onMouseEnter={() => setHover(row.id)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div className="flex justify-center h-[160px] border-b border-gray-300">
                        <img
                          src={row.thumbnail || "/img/no-image.png"}
                          className={`w-full object-cover ${row.thumbnail ? "" : "opacity-50"}`}
                        />
                      </div>
                      <div className="py-2 px-4">
                        <Typography
                          gutterBottom
                          variant="p"
                          component="div"
                          className="flex items-center justify-between text-sm font-semibold"
                        >
                          <span>{row.title}</span>
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
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <Droppable droppableId="odd">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2">
            {odds.map((row, index) => (
              <Draggable key={row.id} draggableId={row.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Paper
                      variant="outlined"
                      className="cursor-pointer hover:shadow-md relative overflow-hidden"
                      style={{ borderRadius: 8 }}
                      onMouseEnter={() => setHover(row.id)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div className="flex justify-center h-[160px] border-b border-gray-300">
                        <img
                          src={row.thumbnail || "/img/no-image.png"}
                          className={`w-full object-cover ${row.thumbnail ? "" : "opacity-50"}`}
                        />
                      </div>
                      <div className="py-2 px-4">
                        <Typography
                          gutterBottom
                          variant="p"
                          component="div"
                          className="flex items-center justify-between text-sm font-semibold"
                        >
                          <span>{row.title}</span>
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
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default ExercisesList;
