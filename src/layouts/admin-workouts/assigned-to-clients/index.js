import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import React, { useEffect, useState } from "react";
import { getClients } from "services/clients";
import Checkbox from "@mui/material/Checkbox";
import _ from "lodash";
import { setToast } from "context";
import Notification from "components/Notification";
import { assignWorkout } from "services/workouts";

const AssignedToClients = (props) => {
  const { open, onClose, workoutId, assignedClients, onFinish } = props;
  const [controller, dispatch] = useMaterialUIController();
  const { loggedInUser } = controller;

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([...assignedClients]);

  useEffect(() => {
    getClientsData();
  }, []);

  const getClientsData = async () => {
    setLoading(true);
    const options = {};
    if (!loggedInUser?.SuperUser) {
      options.trainerId = loggedInUser?.id;
    }
    try {
      const response = await getClients(options);
      setClients(response.data);
    } catch (error) {}
    setLoading(false);
  };

  const assignClient = (clientId) => {
    let assigned = [...selectedClients];
    if (_.includes(selectedClients, clientId)) {
      assigned = _.filter(assigned, (row) => row !== clientId);
    } else {
      assigned.push(clientId);
    }
    setSelectedClients(assigned);
  };

  const onSubmit = async () => {
    if (_.isEmpty(selectedClients)) {
      return;
    }
    setLoading(true);
    try {
      const response = await assignWorkout(workoutId, selectedClients);
      setToast(
        dispatch,
        <Notification type="success" title="Success!" content={`Workout assigned!`} />,
        controller
      );
      onFinish();
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
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Assigned Clients</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-3 gap-2 w-full min-w-[300px] max-w-[720px]">
          {clients.map((client) => (
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                id={client.id}
                value={selectedClients.includes(client.id)}
                checked={selectedClients.includes(client.id)}
                onClick={() => assignClient(client.id)}
              />
              <label className="text-xl" variant="label" htmlFor={client.id}>
                {client.username}
              </label>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <MDButton size="small" variant="contained" color="white" onClick={onClose}>
          Cancel
        </MDButton>
        <MDButton
          disabled={loading}
          size="small"
          variant="gradient"
          color="primary"
          onClick={onSubmit}
        >
          {loading && <CircularProgress size={10} color="white" />}&nbsp;Assign
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default AssignedToClients;
