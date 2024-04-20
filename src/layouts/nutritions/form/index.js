import {
  CircularProgress,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Icon,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Notification from "components/Notification";
import { NUTRITION_TYPE } from "constants";
import { useMaterialUIController } from "context";
import { setToast } from "context";
import { navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import { useEffect, useState } from "react";
import { saveNutrition } from "services/nutritions";

const style = { width: 600 };

const DEFAULT_VALUES = {
  title: null,
  description: null,
  thumbnail: null,
  calories: null,
  fat: null,
  protein: null,
  type: NUTRITION_TYPE.PER_UNIT,
};

const NutritionForm = (props) => {
  const { open, onClose, nutrition = {} } = props;
  const [, dispatch] = useMaterialUIController();
  const [errors, setError] = useState({ title: null });
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    setValues(nutrition.id ? nutrition : DEFAULT_VALUES);
  }, [open]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: !value,
    }));
  };

  const handleClose = () => {
    setValues(DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = false;
    if (!values.title) {
      setError((prev) => ({ ...prev, title: true }));
      errors = true;
    }
    if (!values.calories) {
      setError((prev) => ({ ...prev, calories: true }));
      errors = true;
    }
    if (!values.fat) {
      setError((prev) => ({ ...prev, fat: true }));
      errors = true;
    }
    if (!values.protein) {
      setError((prev) => ({ ...prev, protein: true }));
      errors = true;
    }

    if (errors) {
      return;
    }

    setLoading(true);
    try {
      const response = await saveNutrition(values);
      setToast(
        dispatch,
        <Notification
          type="success"
          title="Success!"
          content={`Nutrition ${nutrition?.id ? "updated" : "created"}!`}
        />
      );
      handleClose();
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setLoading(false);
  };

  const onFileUpload = (event) => {
    const file = event.target.files[0];
    const { name } = event.target;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setValues((prev) => ({
        ...prev,
        [name]: reader.result,
      }));
    };

    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };

  const handleNutritionChange = (event) => {
    const { name, value } = event.target;
    const newValue = value.replace(/[^0-9]/g, "");

    setError((prev) => ({ ...prev, [name]: !value }));

    if (newValue > 999) return;
    setValues((prev) => ({ ...prev, [name]: +newValue }));
    return;
  };

  const Header = () => (
    <Typography variant="h4" className="flex justify-between p-4 border-b">
      {nutrition?.id ? "Edit" : "Add"} New Nutrition
      <IconButton size="small" color="inherit" sx={navbarIconButton} onClick={onClose}>
        <Icon>clear</Icon>
      </IconButton>
    </Typography>
  );

  console.log("values", values);

  return (
    <Drawer open={open} anchor="right" PaperProps={{ style }}>
      <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
        <Header />
        <MDBox className="flex flex-col justify-start h-full overflow-y-auto p-4 gap-4">
          <FormControl fullWidth required error={errors.title}>
            <MDBox>
              <MDInput
                fullWidth
                type="text"
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                error={errors.title}
              />
              {errors.title && <FormHelperText>Title is required</FormHelperText>}
            </MDBox>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Description"
              multiline
              rows={4}
              name="description"
              onChange={handleChange}
              value={values.description}
            />
          </FormControl>

          <div className="flex items-center gap-8">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={values.type}
              onChange={(e) => setValues((state) => ({ ...state, type: e.target.value }))}
            >
              <FormControlLabel
                value={NUTRITION_TYPE.PER_UNIT}
                control={<Radio />}
                label="Per 100 g"
              />
              <FormControlLabel
                value={NUTRITION_TYPE.PER_100_G}
                control={<Radio />}
                label="Per Unit"
              />
            </RadioGroup>
          </div>
          <div className="grid grid-cols-3 justify-center gap-8 py-4">
            <FormControl className="flex flex-col gap-2" required error={errors.calories}>
              <div className="flex items-center gap-2">
                <input
                  name="calories"
                  value={values.calories}
                  onChange={handleNutritionChange}
                  className="w-[55px] h-[55px] text-center rounded-md border border-1 focus:border-2 border-gray-300 p-2 focus:border-[#7560C5] focus:outline-none"
                />
                <span className="flex gap-1 items-center text-sm">
                  <span>g</span> <span>Calories</span>
                </span>
              </div>
              {errors.calories && (
                <FormHelperText style={{ margin: 0 }}>Calories is required</FormHelperText>
              )}
            </FormControl>
            <FormControl className="flex flex-col gap-2" required error={errors.fat}>
              <div className="flex items-center gap-2">
                <input
                  name="fat"
                  value={values.fat}
                  onChange={handleNutritionChange}
                  className="w-[55px] h-[55px] text-center rounded-md border border-1 focus:border-2 border-gray-300 p-2 focus:border-[#7560C5] focus:outline-none"
                />
                <span className="flex gap-1 items-center text-sm">
                  <span>g</span> <span>Fat</span>
                </span>
              </div>
              {errors.fat && <FormHelperText style={{ margin: 0 }}>Fat is required</FormHelperText>}
            </FormControl>
            <FormControl className="flex flex-col gap-2" required error={errors.protein}>
              <div className="flex items-center gap-2">
                <input
                  name="protein"
                  value={values.protein}
                  onChange={handleNutritionChange}
                  className="w-[55px] h-[55px] text-center rounded-md border border-1 focus:border-2 border-gray-300 p-2 focus:border-[#7560C5] focus:outline-none"
                />
                <span className="flex gap-1 items-center text-sm">
                  <span>g</span> <span>Protein</span>
                </span>
              </div>
              {errors.protein && (
                <FormHelperText style={{ margin: 0 }}>Fat is required</FormHelperText>
              )}
            </FormControl>
          </div>

          <FormControl>
            <MDButton variant="gradient" color="primary" component="label" htmlFor="upload-file">
              <Icon>upload</Icon>&nbsp;Upload Thumbnail{" "}
              <input
                hidden
                id="upload-file"
                name="thumbnail"
                accept="image/*"
                type="file"
                onChange={onFileUpload}
              />
            </MDButton>
          </FormControl>
          {values.thumbnail && (
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="grid justify-center items-center rounded-lg border border-gray-300 h-[200px] w-[200px] relative overflow-hidden"
            >
              {hover && (
                <div className="absolute bg-black/30 w-full h-full">
                  <IconButton size="small" color="inherit" sx={navbarIconButton}>
                    <Icon onClick={() => setValues((prev) => ({ ...prev, thumbnail: null }))}>
                      clear
                    </Icon>
                  </IconButton>
                </div>
              )}

              <img src={values.thumbnail} className="w-fit h-full" />
            </div>
          )}
        </MDBox>
        <div className="flex justify-start items-center p-4 border-t text-white gap-2">
          <MDButton size="small" variant="gradient" color="primary" type="submit">
            {loading && <CircularProgress size={10} color="white" />}&nbsp;Save
          </MDButton>
          <MDButton size="small" variant="contained" color="white" type="button" onClick={onClose}>
            Cancel
          </MDButton>
        </div>
      </form>
    </Drawer>
  );
};

export default NutritionForm;
