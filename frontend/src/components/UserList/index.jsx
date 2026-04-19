import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * UserList – sidebar listing all users.
 * Each item links to /users/:userId (UserDetail view).
 * The currently active user is highlighted.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get active userId from the URL (works for both /users/:id and /photos/:id)
  const params = useParams();
  const activeId = params.userId;

  useEffect(() => {
    setLoading(true);
    fetchModel("/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <Typography variant="h6" className="userlist-header">
        Người dùng
      </Typography>
      <Divider />
      <List disablePadding>
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItemButton
              component={Link}
              to={`/users/${user._id}`}
              selected={activeId === user._id}
              className="userlist-item"
            >
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
              />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
