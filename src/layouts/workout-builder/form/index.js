import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import { Input, Typography } from "@mui/material";
import MDInput from "components/MDInput";
import { useEffect, useState } from "react";
import { NUTRITION_TYPE } from "constants";

const EditForm = (props) => {
  const { onClose, open, data = {}, onSubmit } = props;
  const [value, setValue] = useState({});

  useEffect(() => {
    if (data.id) {
      setValue(data);
    } else {
      setTimeout(() => {
        setValue(data);
      }, 1000);
    }
  }, [data]);

  const handleExerciseChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    if (event.target.name === "minutes" || event.target.name === "seconds") {
      if (newValue >= 60) return;
      setValue((prev) => ({ ...prev, [event.target.name]: +newValue }));
      return;
    }

    if (event.target.name === "weight") {
      if (newValue > 999) return;
      setValue((prev) => ({ ...prev, [event.target.name]: +newValue }));
      return;
    }

    if (newValue <= 99) {
      setValue((prev) => ({ ...prev, [event.target.name]: +newValue }));
    }
  };

  const handleNutritionChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    if (newValue > 999) return;
    if (value.type === NUTRITION_TYPE.PER_UNIT) {
      setValue((prev) => ({
        ...prev,
        calories: +newValue + prev.calories,
        fat: +newValue + prev.fat,
        protein: +newValue + prev.protein,
        [event.target.name]: +newValue,
      }));
    }
    if (value.type === NUTRITION_TYPE.PER_100_G) {
      setValue((prev) => ({
        ...prev,
        calories: +newValue + prev.calories,
        fat: +newValue + prev.fat,
        protein: +newValue + prev.protein,
        [event.target.name]: +newValue,
      }));
    }
    return;
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{String(value.title).toUpperCase()}</DialogTitle>
      <DialogContent>
        {value.description && <DialogContentText>{value.description}</DialogContentText>}
        {value.type === "exercises" ? (
          <div className="grid grid-cols-2 justify-center gap-8 p-4 text-[20px]">
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
          <div className="grid grid-cols-2 justify-center gap-8 p-4 text-[20px]">
            <div className="flex items-center gap-2">
              {/* <input
                name="calories"
                value={value.calories}
                onChange={handleNutritionChange}
                className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
              /> */}
              <Typography variant="h3">{value.calories}</Typography>
              <span>g</span> <span>Calories</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <input
                name="fat"
                value={value.fat}
                onChange={handleNutritionChange}
                className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
              /> */}
              <Typography variant="h3">{value.fat}</Typography>
              <span>g</span> <span>Fat</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <input
                name="protein"
                value={value.protein}
                onChange={handleNutritionChange}
                className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
              /> */}
              <Typography variant="h3">{value.protein}</Typography>
              <span>g</span> <span>Protein</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                name="pcs"
                value={value.pcs}
                onChange={handleNutritionChange}
                className="w-[55px] rounded-lg border border-2 border-gray-300 p-2 focus:border-indigo-700/60 focus:outline-none"
              />
              <span>pcs</span>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <MDButton variant="gradient" color="primary" onClick={() => onSubmit(value)}>
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
