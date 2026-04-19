import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ChatBubbleOutline,
  AccessTime,
} from "@mui/icons-material";
import { Link, useParams, useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setTopBarText, advancedMode } = useAppContext();

  // Current photo index (advanced mode)
  const rawIdx = parseInt(searchParams.get("idx") || "0", 10);
  const photoIdx = isNaN(rawIdx) ? 0 : rawIdx;

  const goTo = useCallback(
    (idx) => setSearchParams({ idx: String(idx) }, { replace: false }),
    [setSearchParams]
  );

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

  // Keep idx in bounds when photos load or advancedMode changes
  useEffect(() => {
    if (photos.length > 0 && photoIdx >= photos.length) {
      goTo(photos.length - 1);
    }
  }, [photos, photoIdx, goTo]);

  if (loading) return <CircularProgress size={32} sx={{ m: 3 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (photos.length === 0)
    return (
      <Typography sx={{ m: 2 }} color="text.secondary">
        Người dùng này chưa có ảnh nào.
      </Typography>
    );

  /* ── Advanced mode: single-photo stepper ── */
  if (advancedMode) {
    const current = photos[photoIdx] || photos[0];
    const isFirst = photoIdx === 0;
    const isLast = photoIdx === photos.length - 1;

    return (
      <Box className="userphotos-container">
        {/* Stepper controls */}
        <Box className="stepper-bar">
          <Tooltip title="Ảnh trước">
            <span>
              <IconButton
                onClick={() => goTo(photoIdx - 1)}
                disabled={isFirst}
                color="primary"
              >
                <ArrowBackIos />
              </IconButton>
            </span>
          </Tooltip>

          <Typography variant="body2" color="text.secondary">
            Ảnh {photoIdx + 1} / {photos.length}
          </Typography>

          <Tooltip title="Ảnh tiếp theo">
            <span>
              <IconButton
                onClick={() => goTo(photoIdx + 1)}
                disabled={isLast}
                color="primary"
              >
                <ArrowForwardIos />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Current photo */}
        <PhotoCard photo={current} />

        {/* Text nav buttons (alternative) */}
        <Box className="stepper-text-nav">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIos />}
            onClick={() => goTo(photoIdx - 1)}
            disabled={isFirst}
            size="small"
          >
            Trước
          </Button>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIos />}
            onClick={() => goTo(photoIdx + 1)}
            disabled={isLast}
            size="small"
          >
            Tiếp theo
          </Button>
        </Box>
      </Box>
    );
  }

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
