// imports
import React from "react";
import { Card, CardContent, Typography, Tooltip } from "@mui/material";
import { useDrag } from "react-dnd";
import { TICKET_TOOLTIP_TEXT } from "../helpers/common.constants";

interface ITicketProps {
  ticket: {
    id: string;
    title: string;
    description: string;
  };
  filterCurrentSelectedTicket: (ticketId: string) => void;
}

const Ticket = ({ ticket, filterCurrentSelectedTicket }: ITicketProps) => {
  const { id, title, description } = ticket;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ticket",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Tooltip title={TICKET_TOOLTIP_TEXT} arrow>
      <Card
        ref={drag}
        sx={{ marginBottom: 1, opacity: isDragging ? 0.5 : 1 }}
        onDoubleClick={() => filterCurrentSelectedTicket(id)}
      >
        <CardContent>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default Ticket;
