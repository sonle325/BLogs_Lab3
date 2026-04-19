import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ChatBubbleOutline,
  AccessTime,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import { useAppContext } from "../../context/AppContext";
import "./styles.css";

/** Format an ISO-ish date string into a readable Vietnamese-style string */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Renders a single photo card with its comments */
function PhotoCard({ photo }) {
  return (
    <Card className="photo-card" elevation={2}>
      <CardMedia
        component="img"
        image={`/images/${photo.file_name}`}
        alt={photo.file_name}
        className="photo-img"
      />
      <CardContent>
        <Box className="photo-meta">
          <AccessTime fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {formatDate(photo.date_time)}
          </Typography>
        </Box>

        {/* Comments */}
        {photo.comments && photo.comments.length > 0 ? (
          <Box sx={{ mt: 1.5 }}>
            <Box className="comments-header">
              <ChatBubbleOutline fontSize="small" />
              <Typography variant="subtitle2">
                {photo.comments.length} Bình luận
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            {photo.comments.map((comment) => (
              <Box key={comment._id} className="comment-item">
                <Box className="comment-author-row">
                  <Typography
                    component={Link}
                    to={`/users/${comment.user._id}`}
                    variant="subtitle2"
                    className="comment-author-link"
                  >
                    {comment.user.first_name} {comment.user.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.date_time)}
                  </Typography>
                </Box>
                <Typography variant="body2" className="comment-text">
                  {comment.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Chưa có bình luận nào.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * UserPhotos – displays photos of a user.
 *
 * Normal mode   : shows ALL photos in a scrollable list.
 * Advanced mode : shows ONE photo at a time with Prev / Next buttons.
 *                 The current index is stored in the ?idx= query param so
 *                 the URL is bookmarkable and browser back/forward works.
 */
function UserPhotos() {
  const { userId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setTopBarText } = useAppContext();

  useEffect(() => {
    setLoading(true);
    setPhotos([]);

    Promise.all([
      fetchModel(`/user/${userId}`),
      fetchModel(`/photosOfUser/${userId}`),
    ])
      .then(([user, photoData]) => {
        setTopBarText(`Ảnh của ${user.first_name} ${user.last_name}`);
        setPhotos(photoData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, setTopBarText]);

  if (loading) return <CircularProgress size={32} sx={{ m: 3 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (photos.length === 0)
    return (
      <Typography sx={{ m: 2 }} color="text.secondary">
        Người dùng này chưa có ảnh nào.
      </Typography>
    );

  /* ── Normal mode: all photos ── */
  return (
    <Box className="userphotos-container">
      <Typography variant="h6" gutterBottom>
        {photos.length} ảnh
      </Typography>
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </Box>
  );
}

export default UserPhotos;
