// imports
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// local imports
import {
  INewTicket,
  ITicket,
  TicketStates,
} from "../helpers/common.interfaces";
import {
  TABLE_DIALOG_BUTTONS,
  TABLE_DIALOG_BUTTON_INPUT_LABEL,
  TABLE_DIALOG_BUTTON_TEXT,
  TABLE_DIALOG_DROPDOWN,
} from "../helpers/common.constants";

interface TicketDialogProps {
  open: boolean;
  onClose: () => void;
  currentTicket: ITicket | null;
  updateTicketState: (ticketId: string, newState: TicketStates) => void;
  createNewTicket: (ticketData: INewTicket) => void;
  deleteTicket: (ticketId: string) => void;
}

const TicketDialog: React.FC<TicketDialogProps> = ({
  open,
  onClose,
  currentTicket,
  updateTicketState,
  createNewTicket,
  deleteTicket,
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [currentState, setCurrentState] = React.useState<TicketStates>(
    TicketStates.OPEN
  );

  useEffect(() => {
    if (currentTicket && currentTicket.currentState) {
      setCurrentState(currentTicket.currentState);
    } else {
      setTitle("");
      setDescription("");
      setCurrentState(TicketStates.OPEN);
    }
  }, [currentTicket]);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (currentTicket?.id) {
      await deleteTicket(currentTicket.id);
    }
    handleClose();
  };

  const handleSaveClick = async () => {
    if (currentTicket && currentTicket.currentState !== currentState) {
      await updateTicketState(currentTicket.id, currentState);
    }

    if (!currentTicket) {
      await createNewTicket({
        title: title.length ? title : "New Title",
        description: description.length ? description : "New Description",
        currentState: currentState,
        createdAt: new Date().toString(),
      });
    }

    handleClose();
  };

  const openLinkInNewTab = async () => {
    if (currentTicket?.id) {
      window.open(
        `${window.location.origin}/tickets/${currentTicket.id}`,
        "_blank"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create or Update Ticket</DialogTitle>
      <DialogContent>
        {currentTicket?.id && (
          <>
            <TextField
              margin="dense"
              label="Ticket ID"
              fullWidth
              disabled={true}
              value={currentTicket.id}
              InputProps={{
                readOnly: true,
              }}
            />
            <Button
              onClick={openLinkInNewTab}
              variant="contained"
              color="primary"
              style={{ marginTop: 8, marginBottom: 8 }}
            >
              {TABLE_DIALOG_BUTTON_TEXT}
            </Button>
          </>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={currentTicket?.title ? currentTicket.title : title}
          disabled={currentTicket?.title ? true : false}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={
            currentTicket?.description ? currentTicket.description : description
          }
          disabled={currentTicket?.description ? true : false}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>{TABLE_DIALOG_BUTTON_INPUT_LABEL}</InputLabel>
          <Select
            value={currentState}
            onChange={(e) => setCurrentState(e.target.value as TicketStates)}
          >
            <MenuItem value={TicketStates.OPEN}>
              {TABLE_DIALOG_DROPDOWN.OPEN}
            </MenuItem>
            <MenuItem value={TicketStates.IN_PROGRESS}>
              {TABLE_DIALOG_DROPDOWN.IN_PROGRESS}
            </MenuItem>
            <MenuItem value={TicketStates.CODE_REVIEW}>
              {TABLE_DIALOG_DROPDOWN.CODE_REVIEW}
            </MenuItem>
            <MenuItem value={TicketStates.DONE}>
              {TABLE_DIALOG_DROPDOWN.DONE}
            </MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{TABLE_DIALOG_BUTTONS.CANCEL}</Button>
        <Button onClick={handleDelete} variant="outlined" color="error">
          {TABLE_DIALOG_BUTTONS.DELETE}
        </Button>
        <Button onClick={handleSaveClick} variant="contained" color="primary">
          {TABLE_DIALOG_BUTTONS.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDialog;
