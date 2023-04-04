// imports
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

// local imports
import { HEADER_BUTTON_TEXT, HEADER_TITLE } from "../helpers/common.constants";

interface HeaderProps {
  openDialog: () => void;
}

const Header: React.FC<HeaderProps> = ({ openDialog }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {HEADER_TITLE}
        </Typography>
        <Button variant="contained" onClick={openDialog}>
          {HEADER_BUTTON_TEXT}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
