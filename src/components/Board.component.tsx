// imports
import React from "react";
import { Box } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// local imports
import TicketColumn from "./TicketColumn.component";
import { ITicket, TicketStates } from "../helpers/common.interfaces";

// interfaces
interface IBoardProps {
  tickets: ITicket[];
  updateTickets: React.Dispatch<React.SetStateAction<ITicket[]>>;
  updateTicketState: (ticketId: string, newState: TicketStates) => void;
  filterCurrentSelectedTicket: (ticketId: string) => void;
}

const Board = (props: IBoardProps) => {
  const { tickets, updateTicketState, filterCurrentSelectedTicket } = props;

  const columns = [
    { title: "Open", state: "open" },
    { title: "In Progress", state: "in-progress" },
    { title: "Code Review", state: "code-review" },
    { title: "Done", state: "done" },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 2,
          boxSizing: "border-box",
        }}
      >
        {columns.map((column) => (
          <TicketColumn
            key={column.state}
            title={column.title}
            state={column.state as TicketStates}
            tickets={tickets.filter(
              (ticket) => ticket.currentState === column.state
            )}
            updateTicketState={updateTicketState}
            filterCurrentSelectedTicket={filterCurrentSelectedTicket}
          />
        ))}
      </Box>
    </DndProvider>
  );
};

export default Board;
