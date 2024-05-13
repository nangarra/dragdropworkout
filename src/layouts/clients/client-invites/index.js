import { Card, CircularProgress, Divider, Icon, Typography } from "@mui/material";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import backgroundImage from "assets/images/bg-profile.jpeg";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { NO_PROFILE_PIC } from "constants";
import { getUser } from "services/user";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { setToast } from "context";
import Notification from "components/Notification";
import { setLoggedInUser } from "context";
import { useMaterialUIController } from "context";
import { userSignUp } from "services/auth";
import { TOKEN } from "constants";
import { DEFAULT_ROLES } from "constants";

const ClientInvites = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [values, setValues] = useState({});
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    getTrainerData();
  }, [params.trainerId]);

  const getTrainerData = async () => {
    try {
      const response = await getUser(params.trainerId);
      setUser(response.data);
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      values.type = DEFAULT_ROLES.CLIENT;
      values.trainerId = params.trainerId;
      const response = await userSignUp(values);
      localStorage.setItem(TOKEN, response?.data?.token);
      setLoggedInUser(dispatch, response?.data?.user, controller);
      setToast(
        dispatch,
        <Notification
          type="success"
          title={`Welcome ${response?.data?.user?.username}`}
          content={`Registration successful`}
        />,
        controller
      );
      navigate("/client/workouts");
    } catch (error) {
      setToast(
        dispatch,
        <Notification
          type="error"
          title="Something went wrong"
          content={error?.response?.data?.message || error?.message}
        />,
        controller
      );
    }
    setLoading(false);
  };
  return (
    <BasicLayout>
      <div className="w-full max-w-[720px]">
        <MDBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="18.75rem"
          borderRadius="xl"
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.primary.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
          }}
        />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <MDAvatar
                src={user.profilePic || NO_PROFILE_PIC}
                alt="profile-image"
                size="xl"
                shadow="md"
              />
              <div className="flex flex-col">
                <Typography variant="h4">{user.username}</Typography>
                <Typography variant="h6">{user.Role?.name}</Typography>
              </div>
            </div>

            <div className="flex flex-col items-end text-sm">
              <span className="flex items-center gap-1">
                <Icon className="text-purple-400">email</Icon>
                <Typography variant="b">{user.email || "N/A"}</Typography>
              </span>
              <span className="flex items-center gap-1">
                <Icon className="text-purple-400">phone</Icon>
                <Typography variant="b">{user.phone || "N/A"}</Typography>
              </span>
            </div>
          </div>

          <Divider orientation="horizontal" />

          <div className="flex flex-col gap-8">
            <Typography variant="subtitle2">
              Click here to elevate your fitness with <b>{user.username}</b>, a certified trainer!
            </Typography>
            <Typography>
              <Typography variant="subtitle2">
                <b>Personalized Plans:</b> Achieve your goals with a program built just for you.
              </Typography>
              <Typography variant="subtitle2">
                <b>Proven Results:</b> Join the many who've seen success with my training.
              </Typography>
              <Typography variant="subtitle2">
                <b>Supportive Guidance:</b> Stay motivated and reach your full potential with expert
                help.
              </Typography>
            </Typography>

            <Typography variant="subtitle2">Let's train together!</Typography>
            {accepted ? (
              <div className="flex w-full justify-center">
                <form className="flex flex-col w-full max-w-[400px] gap-4" onSubmit={handleSubmit}>
                  <MDBox>
                    <MDInput
                      required
                      fullWidth
                      type="text"
                      label="Name"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                    />
                  </MDBox>
                  <MDBox>
                    <MDInput
                      required
                      fullWidth
                      name="email"
                      type="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                    />
                  </MDBox>
                  <MDBox>
                    <MDInput
                      required
                      fullWidth
                      name="password"
                      type="password"
                      label="Password"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </MDBox>

                  <MDBox mb={4}>
                    <MDButton
                      disabled={!values.username || !values.email || !values.password || loading}
                      variant="gradient"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
                      {loading && <CircularProgress size={10} color="white" />}&nbsp;Subscribe
                    </MDButton>
                  </MDBox>
                </form>
              </div>
            ) : (
              <div className="flex w-full justify-center mb-4">
                <MDButton
                  size="large"
                  color="primary"
                  variant="gradient"
                  className="w-full max-w-[400px]"
                  onClick={() => setAccepted(true)}
                >
                  Accept
                </MDButton>
              </div>
            )}
          </div>
        </Card>
      </div>
    </BasicLayout>
  );
};

export default ClientInvites;
