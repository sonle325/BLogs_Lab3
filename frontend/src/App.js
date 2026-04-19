import "./App.css";

import React, { useState } from "react";
import { Grid, Paper, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AppContext } from "./context/AppContext";
import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green
    },
    secondary: {
      main: "#81c784", // Light green
    },
  },
});

function App() {
  const [topBarText, setTopBarText] = useState("");
  const [advancedMode, setAdvancedMode] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{ topBarText, setTopBarText, advancedMode, setAdvancedMode }}
      >
        <Router>
          <Grid container spacing={2}>
            {/* ── Top Bar ── */}
            <Grid item xs={12}>
              <TopBar />
            </Grid>

            {/* Buffer below fixed AppBar */}
            <div className="main-topbar-buffer" />

            {/* ── Sidebar: User List ── */}
            <Grid item xs={12} sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>

            {/* ── Main Content Area ── */}
            <Grid item xs={12} sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  <Route path="/photos/:userId" element={<UserPhotos />} />
                  <Route
                    path="/"
                    element={
                      <div className="welcome">
                        <p>👈 Chọn một người dùng từ danh sách bên trái để bắt đầu.</p>
                      </div>
                    }
                  />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
