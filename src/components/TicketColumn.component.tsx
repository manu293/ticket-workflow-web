// imports
import React from "react";
import { Box, Typography } from "@mui/material";
import { useDrop, DropTargetMonitor } from "react-dnd";

// local imports
import Ticket from "./Ticket.component";
import { ITicket, TicketStates } from "../helpers/common.interfaces";

interface TicketColumnProps {
  title: string;
  tickets: ITicket[];
  state: TicketStates;
  updateTicketState: (ticketId: string, newState: TicketStates) => void;
  filterCurrentSelectedTicket: (ticketId: string) => void;
}

const TicketColumn: React.FC<TicketColumnProps> = ({
  title,
  tickets,
  state,
  updateTicketState,
  filterCurrentSelectedTicket,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "ticket",
    drop: (item: { id: string }, monitor: DropTargetMonitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      updateTicketState(item.id, state);
    },
  }));

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginLeft: 2,
        marginRight: 2,
      }}
      ref={drop}
    >
      <Typography variant="h5">{title}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: 1,
        }}
      >
        {tickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            filterCurrentSelectedTicket={filterCurrentSelectedTicket}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TicketColumn;
