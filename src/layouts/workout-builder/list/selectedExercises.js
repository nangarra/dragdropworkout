import { Icon, Paper, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import _ from "lodash";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const BG = [
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
];

const TYPES = {
  EXERCISES: "exercises",
  NUTRITIONS: "nutritions",
};

const SelectedExercises = (props) => {
  const { data = [], hoveredPlace, dragging, editItem, removeItem, error } = props;
  const [hoverItem, setHoverItem] = useState(null);
  const [deleteHover, setDeleteHover] = useState(null);

  const selected =
    data.length < 9 ? [...data, ...Array(9 - data.length).fill({ dummy: true })] : data;

  return (
    <div className="grid grid-cols-3 gap-8 w-full min-h-[750px] relative">
      <div className="col-span-3 w-full h-full absolute grid grid-cols-3 gap-8 top-0 bottom-0 left-0 right-0 z-10">
        {BG.map((bg) => (
          <div
            key={bg.label}
            className="grid items-start justify-center rounded-lg text-[150px] h-[250px]"
          >
            <b
              className={`${error === "selected" && "text-red-400"} ${
                String(hoveredPlace) === bg.label ? "text-indigo-700/60" : "text-gray-100"
              } transition duration-300 ease-in-out`}
              style={{ lineHeight: "normal" }}
            >
              {bg.label}
            </b>
          </div>
        ))}
      </div>

      {selected.map((row, index) =>
        row.id ? (
          <Droppable key={`${index}:${row.id}`} droppableId={String(index + 1)}>
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${
                  hoverItem === index
                    ? `rounded-lg ${
                        deleteHover === index ? "border-2 border border-red-400" : "shadow-md"
                      }`
                    : ""
                } transition duration-300 ease-in-out flex flex-col gap-2 z-20 relative overflow-hidden`}
                onMouseEnter={() => setHoverItem(index)}
                onMouseLeave={() => setHoverItem(null)}
              >
                <Draggable draggableId={`${index}:${row.id}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: hoverItem === index && !dragging ? "auto" : 0 }}
                        className="absolute top-0 right-0 grid w-full h-[159px] justify-end overflow-hidden z-50 bg-white"
                      >
                        <div className="flex flex-col items-center gap-2 p-2">
                          <Tooltip title="Remove" placement="right">
                            <Icon
                              onClick={() => removeItem(index)}
                              onMouseEnter={() => setDeleteHover(index)}
                              onMouseLeave={() => setDeleteHover(null)}
                              className="text-gray-400 hover:text-red-400 cursor-pointer font-bold"
                            >
                              close
                            </Icon>
                          </Tooltip>
                          {/* <Tooltip title="Edit" placement="right">
                            <Icon
                              onClick={() => editItem(row)}
                              className="text-gray-400 hover:text-blue-400 cursor-pointer"
                            >
                              edit
                            </Icon>
                          </Tooltip> */}
                        </div>
                      </motion.div>
                      <div className="flex items-center justify-center h-[150px] rounded-lg overflow-hidden cursor-drag">
                        <img
                          src={row.thumbnail || "/img/no-image.png"}
                          className={`w-1/2 h-fit object-cover ${
                            row.thumbnail ? "" : "opacity-50"
                          }`}
                        />
                      </div>
                      <Typography
                        variant="p"
                        component="div"
                        className="flex items-center justify-center font-semibold text-lg pb-1 pt-2"
                      >
                        <span>{row.title}</span>
                      </Typography>
                      {row.type === TYPES.EXERCISES && (
                        <div
                          className="grid grid-cols-2 text-xs justify-center cursor-pointer hover:bg-indigo-700/30 hover:text-white transition duration-300 ease-in-out"
                          onClick={() => editItem(row)}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">
                              {row.sets
                                ? Number(row.sets).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                  })
                                : "--"}
                            </b>
                            <span>Sets</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">
                              {row.repititions
                                ? Number(row.repititions).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                  })
                                : "--"}
                            </b>
                            <span>Reps</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="flex items-center">
                              <b className="text-lg">
                                {row.minutes
                                  ? Number(row.minutes).toLocaleString("en-US", {
                                      minimumIntegerDigits: 2,
                                    })
                                  : "00"}
                              </b>
                              <h5>:</h5>&nbsp;
                              <b className="text-lg">
                                {row.seconds
                                  ? Number(row.seconds).toLocaleString("en-US", {
                                      minimumIntegerDigits: 2,
                                    })
                                  : "00"}
                              </b>
                            </span>
                            <span>Rest</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">
                              {row.weight
                                ? Number(row.weight).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                  })
                                : "--"}
                            </b>
                            <span>KG</span>
                          </div>
                        </div>
                      )}
                      {row.type === TYPES.NUTRITIONS && (
                        <div className="grid grid-cols-2 text-xs justify-center cursor-pointer hover:text-indigo-700/60 transition duration-300 ease-in-out">
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">{row.calories || "--"}</b> <span>g</span>{" "}
                            <span>Calories</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">{row.fat || "--"}</b> <span>g</span>{" "}
                            <span>Fat</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">{row.protein || "--"}</b> <span>g</span>{" "}
                            <span>Protein</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <b className="text-lg">{row.pcs || "--"}</b> <span>g</span>{" "}
                            <span>pcs</span>
                          </div>
                        </div>
                      )}
                    </li>
                  )}
                </Draggable>
              </ul>
            )}
          </Droppable>
        ) : (
          <Droppable key={row.id} droppableId={String(index + 1)}>
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2 z-20 relative h-[250px]"
              ></ul>
            )}
          </Droppable>
        )
      )}
    </div>
  );
};

export default SelectedExercises;
