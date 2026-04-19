import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import { useAppContext } from "../../context/AppContext";
import "./styles.css";

/**
 * TopBar – fixed navigation bar.
 *
 * Left  : App name / student name
 * Center: Context-aware view title (e.g. "Ian Malcolm" or "Photos of Rey Kenobi")
 * Right : "Bật tính năng nâng cao" checkbox (bonus feature toggle)
 */
function TopBar() {
  const { topBarText } = useAppContext();

  return (
    <AppBar position="fixed" className="topbar-appBar">
      <Toolbar>
        {/* Left – app / student name */}
        <Typography variant="h6" className="topbar-title" noWrap>
          Lê Hải Sơn
        </Typography>

        {/* Center – current view context */}
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          {topBarText && (
            <Typography variant="subtitle1" noWrap>
              {topBarText}
            </Typography>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
