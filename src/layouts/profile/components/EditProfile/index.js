import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  CircularProgress,
  Drawer,
  FormControl,
  FormHelperText,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Notification from "components/Notification";
import { COUNTRY_LIST, LOGGED_IN_USER } from "constants";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import { setToast, useMaterialUIController } from "context";
import { navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import _ from "lodash";
import { useEffect, useState } from "react";
import { saveLoggedInUser } from "services/user";
import MDTypography from "components/MDTypography";

const style = { width: 600 };

const SOCIALS = [
  {
    link: "",
    icon: <FacebookIcon fontSize="large" />,
    color: "facebook",
  },
  {
    link: "",
    icon: <TwitterIcon fontSize="large" />,
    color: "twitter",
  },
  {
    link: "",
    icon: <InstagramIcon fontSize="large" />,
    color: "instagram",
  },
];

const EditProfile = (props) => {
  const { open, onClose, nutrition = {} } = props;

  const loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_USER));

  const { socialMediaColors } = colors;
  const { size } = typography;

  const [, dispatch] = useMaterialUIController();
  const [errors, setError] = useState({ username: null, email: null });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (_.isEmpty(loggedInUser.socials)) {
      loggedInUser.socials = _.map(SOCIALS, (row) => ({ ...row, name: row.color, link: null }));
    }
    setUser(loggedInUser);
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: !value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = false;
    if (!user.username) {
      setError((prev) => ({ ...prev, username: true }));
      errors = true;
    }
    if (!user.email) {
      setError((prev) => ({ ...prev, email: true }));
      errors = true;
    }

    if (errors) {
      return;
    }

    setLoading(true);
    try {
      const response = await saveLoggedInUser(user);
      localStorage.setItem(LOGGED_IN_USER, JSON.stringify(response.data));
      setToast(
        dispatch,
        <Notification type="success" title="Success!" content="Profile updated!" />
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

  const handleSocialChange = (event) => {
    const { value, name } = event.target;

    const socials = _.map(user.socials, (row) => {
      if (row.name === name) {
        row.link = value;
      }
      return row;
    });
    setUser((prev) => ({ ...prev, socials }));
  };

  const Header = () => (
    <Typography variant="h4" className="flex justify-between p-4 border-b">
      Edit Profile
      <IconButton size="small" color="inherit" sx={navbarIconButton} onClick={onClose}>
        <Icon>clear</Icon>
      </IconButton>
    </Typography>
  );

  return (
    <Drawer open={open} anchor="right" PaperProps={{ style }}>
      <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
        <Header />
        <MDBox className="flex flex-col justify-start h-full overflow-y-auto p-4 gap-6">
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            General Info
          </MDTypography>
          <FormControl fullWidth required error={errors.username}>
            <MDBox>
              <MDInput
                fullWidth
                type="text"
                name="username"
                label="Name"
                value={user.username}
                onChange={handleChange}
                error={errors.username}
              />
              {errors.username && <FormHelperText>Name is required</FormHelperText>}
            </MDBox>
          </FormControl>

          <FormControl fullWidth required error={errors.email}>
            <MDBox>
              <MDInput
                fullWidth
                type="email"
                name="email"
                label="Email"
                value={user.email}
                onChange={handleChange}
                error={errors.email}
              />
              {errors.email && <FormHelperText>Email is required</FormHelperText>}
            </MDBox>
          </FormControl>

          <FormControl fullWidth>
            <MDBox>
              <MDInput
                fullWidth
                type="number"
                name="phone"
                label="Phone Number"
                value={user.phone}
                onChange={handleChange}
              />
            </MDBox>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="Location">Location</InputLabel>
            <Select
              label="Location"
              labelId="Location"
              className="p-[0.75rem]"
              name="location"
              value={user.location}
              id="demo-simple-select"
              onChange={handleChange}
              MenuProps={{
                MenuListProps: { className: "max-h-[20rem] overflow-y-auto" }, // Apply Tailwind classes
              }}
            >
              {COUNTRY_LIST.map((row) => (
                <MenuItem value={row.label}>{row.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            About me
          </MDTypography>

          <FormControl fullWidth>
            <TextField
              rows={4}
              multiline
              name="description"
              label="Description"
              onChange={handleChange}
              value={user.description}
            />
          </FormControl>

          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            Socials Links
          </MDTypography>

          {SOCIALS.map((row) => (
            <FormControl fullWidth>
              <div className="flex items-center gap-4">
                <MDBox
                  key={row.color}
                  fontSize={size.lg}
                  color={socialMediaColors[row.color].main}
                  lineHeight={1}
                >
                  {row.icon}
                </MDBox>
                <MDInput
                  fullWidth
                  type="text"
                  name={row.color}
                  label={row.color}
                  value={_.find(user.socials, (social) => social.name === row.color)?.link}
                  onChange={handleSocialChange}
                />
              </div>
            </FormControl>
          ))}
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

export default EditProfile;
