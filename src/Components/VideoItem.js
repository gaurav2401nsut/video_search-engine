import React from "react";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { decodeHtml } from "../util";
import { LazyLoadImage } from "react-lazy-load-image-component";
const useStyles = makeStyles((theme) => ({
  bigbox: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      height: "calc(100px + 0.5vh) !important",
      width: "25vw !important",
      alignItems: "center",
      marginLeft: "20px",
    },
  },
  box: {
    height: "300px",
    width: "320px",
  },
  videoContent: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "10px",
    },
  },
  imagelg: {
    [theme.breakpoints.up("md")]: {
      height: "90px !important",
      width: "120px !important",
    },
  },
  image: {
    height: "180px",
    width: "320px",
  },
  title: {
    color: "#212121",
    fontSize: "calc(10px + 0.4vh + 0.2vw)",
    marginBottom: "3px",
  },
  channelTitle: {
    color: "#878787",
    fontSize: "smaller",
    marginTop: "3px",
  },
}));

export default function VideoItem(props) {
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));
  const { videoItem, selectedVideoHandler, selectedVideo } = props;
  const classes = useStyles();
  let boxVideoItem = {};
  if (videoItem)
    boxVideoItem = {
      style: { cursor: "pointer" },
      onClick: () => {
        selectedVideoHandler(videoItem);
      },
    };
  let videoTitle = "";
  if (videoItem) videoTitle = decodeHtml(videoItem.snippet.title);
  return (
    <Grid item>
      <Box
        className={`${classes.box} ${selectedVideo ? classes.bigbox : ""}`}
        {...boxVideoItem}
      >
        {videoItem && (
          <>
            <LazyLoadImage
              effect="blur"
              loading="lazy"
              className={`${classes.image} ${
                selectedVideo ? classes.imagelg : ""
              }`}
              alt={videoItem.snippet.title}
              src={
                isBigScreen && selectedVideo
                  ? videoItem.snippet.thumbnails.default.url
                  : videoItem.snippet.thumbnails.medium.url
              }
              placeholder={
                <Skeleton variant="rect" className={classes.image} />
              }
              scrollPosition={props.scrollPosition}
            />
            <div className={classes.videoContent}>
              <p className={classes.title}>
                {videoTitle.length > 60
                  ? videoTitle.substring(0, 60) + "...."
                  : videoTitle}
              </p>
              <p className={classes.channelTitle}>
                {videoItem.snippet.channelTitle.length > 30
                  ? videoItem.snippet.channelTitle.substring(0, 30) + "..."
                  : videoItem.snippet.channelTitle}
              </p>
            </div>
          </>
        )}
        {!videoItem && <Skeleton variant="rect" className={classes.image} />}
        {!videoItem && (
          <Skeleton variant="text" className={classes.skeletonTitle} />
        )}
        {!videoItem && (
          <Skeleton
            variant="text"
            width="40%"
            className={classes.skeletonChannel}
          />
        )}
      </Box>
    </Grid>
  );
}
