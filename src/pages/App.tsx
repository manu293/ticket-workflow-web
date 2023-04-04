// imports
import React, { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// local imports
import Board from "../components/Board.component";
import Header from "../components/Header.component";
import TicketDialog from "../components/TicketDialog.component";
import {
  INewTicket,
  ITicket,
  TicketStates,
} from "../helpers/common.interfaces";

function App() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<ITicket | null>(null);
  const [handlePopStateCalled, setHandlePopStateCalled] = useState(false);

  const fetchTickets = async () => {
    try {
      const ticketResp = await fetch(
        "https://ticket-workflow-app.onrender.com/api/v1/tickets"
      );
      const data = await ticketResp.json();
      if (data && data.length) setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTicket = async (ticketData: INewTicket) => {
    try {
      const ticketResp = await fetch(
        "https://ticket-workflow-app.onrender.com/api/v1/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        }
      );
      const data = await ticketResp.json();
      if (data) setTickets((prevTickets) => [...prevTickets, data]);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handlePopState = () => {
    if (!handlePopStateCalled) {
      setHandlePopStateCalled(true);
      const ticketId = window.location.pathname.split("/tickets/")[1];
      console.log("ticketId", ticketId);
      if (ticketId) {
        filterCurrentSelectedTicket(ticketId);
      } else {
        handleTicketDialogClose();
      }
    }
  };

  useEffect(() => {
    fetchTickets();

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (tickets.length && !handlePopStateCalled) {
      handlePopState();
    }
  }, [tickets]);

  const updateTicketState = async (
    ticketId: string,
    newState: TicketStates
  ) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, currentState: newState } : ticket
      )
    );
    fetch(
      `https://ticket-workflow-app.onrender.com/api/v1/tickets/${ticketId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentState: newState }),
      }
    );
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      const response = await fetch(
        `https://ticket-workflow-app.onrender.com/api/v1/tickets/${ticketId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== ticketId)
        );
      } else {
        console.error("Error deleting ticket:", response);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const renderLoader = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );

  const handleTicketDialogClose = () => {
    setDialogOpen(false);
    setCurrentTicket(null);
  };

  const filterCurrentSelectedTicket = (ticketId: string) => {
    const filteredTicket = tickets.find((ticket) => ticket.id === ticketId);
    if (filteredTicket) {
      setCurrentTicket(filteredTicket);
      setDialogOpen(true);
    }
  };

  const renderBoard = () => (
    <Board
      tickets={tickets}
      updateTickets={setTickets}
      updateTicketState={updateTicketState}
      filterCurrentSelectedTicket={filterCurrentSelectedTicket}
    />
  );

  return (
    <Router>
      <Header openDialog={() => setDialogOpen(true)} />
      {loading ? (
        renderLoader()
      ) : (
        <Routes>
          <Route path="/" element={renderBoard()} />

          <Route path="/tickets/:ticketId" element={renderBoard()} />
        </Routes>
      )}
      <TicketDialog
        open={dialogOpen}
        onClose={handleTicketDialogClose}
        currentTicket={currentTicket}
        updateTicketState={updateTicketState}
        createNewTicket={createNewTicket}
        deleteTicket={deleteTicket}
      />
    </Router>
  );
}

export default App;
