import { Paper, Typography } from "@mui/material";
import _ from "lodash";
import React from "react";
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

const dummy = [
  {
    id: "qelqjwelk-qjwlekjqw-lekjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqjwelk-qjwlekjqw-lekdasdjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqjwelk-qjwlekjqw-lekjq-wkeadasd",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqjwelk-qjwlekjqw-lekjq-wkeasddd",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqjwelk-qjwasdaslekjqw-lekjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqasdasdjwelk-qjwlekjqw-lekjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqjwelk-qjwlekjqw-lekddasjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqfffggjwelk-qjwlekjqw-lekjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
  {
    id: "qelqjwelk-qjwlekjqw-lgggekjq-wke",
    title: "SMOOTHIE",
    calories: 15,
    fat: 0,
    protein: 11,
    pcs: 1,
    thumbnail:
      "https://www.eatingwell.com/thmb/KCDDSEVOd4pRYoDokPJ4cUuwLxI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EWL-57793-berry-kefir-smoothie-Hero-01-A-ae9e20c50f1843928b81c102bfa80b4c.jpg",
  },
];

const SelectedExercises = (props) => {
  const { data = [], hoveredPlace } = props;

  const selected =
    data.length < 9 ? [...data, ...Array(9 - data.length).fill({ dummy: true })] : data;

  return (
    <div className="grid grid-cols-3 gap-8 w-full min-h-[900px] relative">
      <div className="col-span-3 w-full h-full absolute grid grid-cols-3 gap-4 top-0 bottom-0 left-0 right-0 z-10">
        {BG.map((bg) => (
          <div
            key={bg.label}
            className="grid items-center justify-center rounded-lg text-[120px] h-[300px]"
          >
            <b
              className={`${
                String(hoveredPlace) === bg.label ? "text-indigo-700/60" : "text-gray-100"
              } transition duration-300 ease-in-out`}
            >
              {bg.label}
            </b>
          </div>
        ))}
      </div>

      {selected.map((row, index) =>
        row.id ? (
          <Droppable key={row.id} droppableId={String(index + 1)}>
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2 z-20 relative"
              >
                <Draggable draggableId={row.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style, transition: "none" }}
                    >
                      <div className="flex justify-center h-[200px] rounded-lg overflow-hidden cursor-drag">
                        <img
                          src={row.thumbnail || "/img/no-image.png"}
                          className={`w-full object-cover ${row.thumbnail ? "" : "opacity-50"}`}
                        />
                      </div>
                      <Typography
                        variant="p"
                        component="div"
                        className="flex items-center justify-center font-semibold text-lg py-1"
                      >
                        <span>{row.title}</span>
                      </Typography>
                      <div className="grid grid-cols-2 text-xs justify-center">
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
                className="flex flex-col gap-2 z-20 relative"
              ></ul>
            )}
          </Droppable>
        )
      )}
    </div>
  );
};

export default SelectedExercises;
