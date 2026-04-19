import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Checkbox,
  FormControlLabel,
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
  const { topBarText, advancedMode, setAdvancedMode } = useAppContext();

  return (
    <AppBar position="fixed" className="topbar-appBar">
      <Toolbar>
        {/* Left – app / student name */}
        <Typography variant="h6" className="topbar-title" noWrap>
          PhotoApp
        </Typography>

        {/* Center – current view context */}
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          {topBarText && (
            <Typography variant="subtitle1" noWrap>
              {topBarText}
            </Typography>
          )}
        </Box>

        {/* Right – advanced feature toggle */}
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedMode}
              onChange={(e) => setAdvancedMode(e.target.checked)}
              sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: "white" }}>
              Bật tính năng nâng cao
            </Typography>
          }
        />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
