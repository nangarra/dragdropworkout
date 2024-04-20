import { Icon, IconButton, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import classNames from "classnames";
import MDButton from "components/MDButton";
import { NUTRITION_TYPE } from "constants";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const EditForm = (props) => {
  const { onClose, open, data = {}, onSubmit } = props;
  const [value, setValue] = useState({});
  const [initialValue, setInitialValue] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    if (data.id) {
      setValue(data);
      setInitialValue(data);
    } else {
      setTimeout(() => {
        setValue(data);
        setInitialValue(data);
      }, 300);
    }
  }, [data]);

  const done = () => {
    if (value.nutritionType === NUTRITION_TYPE.PER_UNIT && value.pcs < 1) {
      setError("pcs cannot be less than 1");
      return;
    }

    if (value.nutritionType === NUTRITION_TYPE.PER_100_G && value.grams < 100) {
      setError("grams cannot be less than a 100g");
      return;
    }
    setError(null);
    onSubmit(value);
  };

  const handleExerciseChange = (event) => {
    const newValue = Number(event.target.value.replace(/[^0-9]/g, ""));
    if (event.target.name === "minutes" || event.target.name === "seconds") {
      if (newValue >= 60) return;
      setValue((prev) => ({ ...prev, [event.target.name]: newValue }));
      return;
    }

    if (event.target.name === "weight") {
      if (newValue > 999) return;
      setValue((prev) => ({ ...prev, [event.target.name]: newValue }));
      return;
    }

    if (newValue <= 99) {
      setValue((prev) => ({ ...prev, [event.target.name]: newValue }));
    }
  };

  const handleNutritionChange = (event) => {
    setError(null);
    const { value: eventValue, name } = event.target;
    const newValue = Number(eventValue.replace(/[^0-9]/g, ""));
    if (newValue > 999) return;

    const protein = initialValue.protein;
    const calories = initialValue.calories;
    const fat = initialValue.fat;
    if (value.nutritionType === NUTRITION_TYPE.PER_UNIT) {
      setValue((prev) => ({
        ...prev,
        calories: Number(newValue * calories),
        fat: Number(newValue * fat),
        protein: Number(newValue * protein),
        [name]: newValue,
      }));
    }

    if (value.nutritionType === NUTRITION_TYPE.PER_100_G) {
      setValue((prev) => ({
        ...prev,
        calories: Number((newValue * calories) / 100).toFixed(1),
        fat: Number((newValue * fat) / 100).toFixed(1),
        protein: Number((newValue * protein) / 100).toFixed(1),
        [name]: newValue,
      }));
    }
    return;
  };

  const handleKeyDown = (event) => {
    setError(null);
    const { code } = event;
    const { name, value: eventValue } = event.target;
    let newValue = Number(eventValue.replace(/[^0-9]/g, ""));
    if (newValue > 999) return;

    if (code === "ArrowUp") {
      newValue += 1;
    }
    if (code === "ArrowDown") {
      newValue -= 1;
    }

    if (value.nutritionType === NUTRITION_TYPE.PER_100_G && newValue < 100) {
      return;
    }
    if (value.nutritionType === NUTRITION_TYPE.PER_UNIT && newValue < 1) {
      return;
    }

    const protein = initialValue.protein;
    const calories = initialValue.calories;
    const fat = initialValue.fat;
    if (value.nutritionType === NUTRITION_TYPE.PER_100_G) {
      setValue((prev) => ({
        ...prev,
        calories: Number((newValue * calories) / 100).toFixed(1),
        fat: Number((newValue * fat) / 100).toFixed(1),
        protein: Number((newValue * protein) / 100).toFixed(1),
        [name]: newValue,
      }));
    }
    if (value.nutritionType === NUTRITION_TYPE.PER_UNIT) {
      setValue((prev) => ({
        ...prev,
        calories: newValue * calories,
        fat: newValue * fat,
        protein: newValue * protein,
        [name]: newValue,
      }));
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{String(value.title).toUpperCase()}</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3 overflow-hidden min-w-[400px]">
          {value.description && <DialogContentText>{value.description}</DialogContentText>}
          {value.type === "exercises" ? (
            <div className="grid grid-cols-2 justify-center gap-8 text-[20px]">
              <div className="flex items-center gap-2">
                <input
                  name="sets"
                  value={value.sets}
                  onChange={handleExerciseChange}
                  className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
                />
                <span>Sets</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  name="repititions"
                  value={value.repititions}
                  onChange={handleExerciseChange}
                  className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
                />
                <span>Reps</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  placeholder="00"
                  name="minutes"
                  value={value.minutes}
                  onChange={handleExerciseChange}
                  className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
                />
                <input
                  placeholder="00"
                  name="seconds"
                  value={value.seconds}
                  onChange={handleExerciseChange}
                  className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
                />
                <span>Rest</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  name="weight"
                  value={value.weight}
                  onChange={handleExerciseChange}
                  className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
                />
                <span>KG</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-center gap-8 text-[20px]">
              <div className="flex items-center gap-2">
                <Typography variant="h3" style={{ fontWeight: 500 }}>
                  {value.calories}
                </Typography>
                <span>g</span> <span>Calories</span>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="h3" style={{ fontWeight: 500 }}>
                  {value.fat}
                </Typography>
                <span>g</span> <span>Fat</span>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="h3" style={{ fontWeight: 500 }}>
                  {value.protein}
                </Typography>
                <span>g</span> <span>Protein</span>
              </div>
              {value.nutritionType === NUTRITION_TYPE.PER_100_G ? (
                <div className="flex items-center gap-1">
                  <input
                    name="grams"
                    value={value.grams}
                    onChange={handleNutritionChange}
                    onKeyDown={handleKeyDown}
                    className={classNames(
                      "w-[55px] rounded-lg border border-2  p-2 focus:border-indigo-700/60 focus:outline-none",
                      error ? "border-red-300" : "border-gray-300"
                    )}
                  />
                  <div className="flex flex-col">
                    <IconButton
                      id="up"
                      size="small"
                      color="inherit"
                      style={{ padding: 0 }}
                      onClick={() =>
                        handleKeyDown({
                          code: "ArrowUp",
                          target: { name: "grams", value: value.grams.toString() },
                        })
                      }
                    >
                      <Icon fontSize="small">arrow_drop_up</Icon>
                    </IconButton>
                    <IconButton
                      id="down"
                      size="small"
                      color="inherit"
                      style={{ padding: 0 }}
                      onClick={() =>
                        handleKeyDown({
                          code: "ArrowDown",
                          target: { name: "grams", value: value.grams.toString() },
                        })
                      }
                    >
                      <Icon fontSize="small">arrow_drop_down</Icon>
                    </IconButton>
                  </div>
                  <span>g</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    name="pcs"
                    value={value.pcs}
                    onChange={handleNutritionChange}
                    className={classNames(
                      "w-[55px] rounded-lg border border-2  p-2 focus:border-indigo-700/60 focus:outline-none",
                      error ? "border-red-300" : "border-gray-300"
                    )}
                  />
                  <div className="flex flex-col">
                    <IconButton
                      id="up"
                      size="small"
                      color="inherit"
                      style={{ padding: 0 }}
                      onClick={() =>
                        handleKeyDown({
                          code: "ArrowUp",
                          target: { name: "pcs", value: value.pcs.toString() },
                        })
                      }
                    >
                      <Icon fontSize="small">arrow_drop_up</Icon>
                    </IconButton>
                    <IconButton
                      id="down"
                      size="small"
                      color="inherit"
                      style={{ padding: 0 }}
                      onClick={() =>
                        handleKeyDown({
                          code: "ArrowDown",
                          target: { name: "pcs", value: value.pcs.toString() },
                        })
                      }
                    >
                      <Icon fontSize="small">arrow_drop_down</Icon>
                    </IconButton>
                  </div>
                  <span>pcs</span>
                </div>
              )}
            </div>
          )}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.05 }}
                className="text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
      <DialogActions>
        <MDButton variant="gradient" color="primary" onClick={done}>
          Done
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

EditForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default EditForm;
