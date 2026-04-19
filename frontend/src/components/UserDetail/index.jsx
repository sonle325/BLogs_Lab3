import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import { useAppContext } from "../../context/AppContext";
import "./styles.css";

/**
 * UserDetail – displays full profile information for a single user.
 * Sets the TopBar context text to the user's name.
 * Provides a link to view the user's photos (UserPhotos).
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setTopBarText } = useAppContext();

  useEffect(() => {
    setLoading(true);
    setUser(null);

    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setTopBarText(`${data.first_name} ${data.last_name}`);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, setTopBarText]);

  if (loading) return <CircularProgress size={32} sx={{ m: 3 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return null;

  return (
    <Box className="userdetail-container">
      {/* ── Header ── */}
      <Box className="userdetail-header">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {user.first_name} {user.last_name}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ── Details ── */}
      <Box className="userdetail-info">
        <Box className="userdetail-row">
          <Typography variant="body1">
            <strong>Địa điểm:</strong> {user.location}
          </Typography>
        </Box>

        <Box className="userdetail-row">
          <Typography variant="body1">
            <strong>Nghề nghiệp:</strong> {user.occupation}
          </Typography>
        </Box>

        <Box className="userdetail-row" sx={{ alignItems: "flex-start" }}>
          <Typography variant="body1">
            <strong>Giới thiệu:</strong> {user.description}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ── Photo Link ── */}
      <Button
        component={Link}
        to={`/photos/${user._id}`}
        variant="contained"
        color="primary"
      >
        Xem ảnh của {user.first_name}
      </Button>
    </Box>
  );
}

export default UserDetail;
