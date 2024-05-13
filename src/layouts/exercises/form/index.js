import {
  CircularProgress,
  Drawer,
  FormControl,
  FormHelperText,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Notification from "components/Notification";
import { setToast, useMaterialUIController } from "context";
import { navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import { motion } from "framer-motion";
import _ from "lodash";
import { useEffect, useState } from "react";
import { saveExercise } from "services/exercises";

const style = { width: "92%", maxWidth: 600 };

const DEFAULT_VALUES = { title: null, description: null, discipline: [], thumbnail: null };

const CustomChipSelect = ({ value, onChange, errors }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleDeleteChip = (chipToDelete) => {
    onChange(value.filter((chip) => chip !== chipToDelete));
  };

  return (
    <Stack direction="column" spacing={1}>
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        label="Discipline"
        variant="outlined"
      />

      {errors.discipline && (
        <FormHelperText className="pl-4">Discipline is required</FormHelperText>
      )}
      <div className="flex flex-wrap gap-1">
        {value.map((chip) => (
          <motion.div
            key={chip}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="cursor-default text-white bg-[#7560C5] rounded rounded-full py-1 pl-3 pr-1 flex gap-1 items-center text-xs hover:bg-[#7560C5]/70 transition duration-300 ease-in-out">
              <b>{chip}</b>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                onClick={() => handleDeleteChip(chip)}
              >
                <Icon>close</Icon>
              </IconButton>
            </div>
          </motion.div>
        ))}
      </div>
    </Stack>
  );
};

const ExerciseForm = (props) => {
  const { open, onClose, exercise = {} } = props;
  const [controller, dispatch] = useMaterialUIController();
  const [errors, setError] = useState({ title: null });
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    setValues(exercise.id ? exercise : DEFAULT_VALUES);
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
    setTimeout(() => {
      setError({ title: false, discipline: false });
      setValues(DEFAULT_VALUES);
    }, 300);
    onClose();
  };

  const handleSubmit = async () => {
    let errors = false;

    if (!values.title) {
      setError((prev) => ({ ...prev, title: true }));
      errors = true;
    }

    if (_.isEmpty(values.discipline)) {
      setError((prev) => ({ ...prev, discipline: true }));
      errors = true;
    }

    if (errors) {
      return;
    }

    setLoading(true);
    try {
      const response = await saveExercise(values);
      setToast(
        dispatch,
        <Notification
          type="success"
          title="Success!"
          content={`Exercise ${exercise?.id ? "updated" : "created"}!`}
        />,
        controller
      );
      handleClose();
    } catch (error) {
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />,
        controller
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

  const Header = () => (
    <Typography variant="h4" className="flex justify-between p-4 border-b">
      {exercise?.id ? "Edit" : "Add"} New Exercise
      <IconButton size="small" color="inherit" sx={navbarIconButton} onClick={handleClose}>
        <Icon>clear</Icon>
      </IconButton>
    </Typography>
  );

  const handleChipChange = (discipline) => {
    setValues((prev) => ({ ...prev, discipline }));
    setError((prev) => ({ ...prev, discipline: false }));
  };

  return (
    <Drawer open={open} anchor="right" PaperProps={{ style }}>
      <form className="flex flex-col justify-between h-full">
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
                error={errors.title}
                onChange={handleChange}
              />
              {errors.title && <FormHelperText>Title is required</FormHelperText>}
            </MDBox>
          </FormControl>

          <FormControl fullWidth required error={errors.discipline}>
            <MDBox>
              {/* <MDInput
                fullWidth
                type="text"
                name="discipline"
                label="Discipline"
                onChange={handleChange}
                value={values.discipline}
                error={errors.discipline}
              /> */}

              <CustomChipSelect
                errors={errors}
                value={values.discipline}
                onChange={handleChipChange}
              />
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

          <FormControl>
            <MDButton variant="gradient" color="primary" component="label" htmlFor="upload-file">
              <Icon>upload</Icon>&nbsp;Upload Thumbnail{" "}
              <input
                hidden
                id="upload-file"
                name="thumbnail"
                type="file"
                accept="image/*"
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
          <MDButton
            size="small"
            variant="gradient"
            color="primary"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <CircularProgress size={10} color="white" />}&nbsp;Save
          </MDButton>
          <MDButton
            size="small"
            variant="contained"
            color="white"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </MDButton>
        </div>
      </form>
    </Drawer>
  );
};

export default ExerciseForm;
