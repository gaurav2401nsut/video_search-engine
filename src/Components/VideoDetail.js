import React from "react";
import youtubeVideoDetailAPI from "../axios-instance";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import axios from "axios";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
const useStyles = makeStyles((theme) => ({
  videoDetail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "25px",
  },
  videoContent: {
    width: "90%",
  },
  videoPlayer: {
    width: "90vw",
    alignSelf: "center",
    marginTop: "10px",
    [theme.breakpoints.up("md")]: {
      width: "60vw",
      height: "65vh",
    },
    [theme.breakpoints.up("sm")]: {
      height: "calc(50vh + 10vw)",
    },
    height: "50vw",
  },
  voteButton: {
    background: "none",
    border: "none",
    height: "min-content",
    width: "min-content",
  },
  vote: {
    cursor: "pointer",
    margin: "auto 10px",
    color: "#696969",
  },
  voteBox: {
    display: "flex",
    alignItems: "center",
  },
  videoStat: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
function numberWithCommas(x) {
  if (!x) return 0;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function DateConvertor(date, isSmallScreen) {
  let d = date.substring(0, 10).split("-");
  console.log(d);
  var month = [];
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  let currDate = new Date();
  return `${
    isSmallScreen
      ? month[Number(d[1]) - 1].substring(0, 3)
      : month[Number(d[1]) - 1]
  } ${Number(d[2])}${currDate.getFullYear() > d[0] ? ` ,${d[0]}` : ""}`;
}
function convertToInternationalCurrencySystem(labelValue) {
  if (!labelValue) return 0;
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue));
}
export default function VideoDetail({ video }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { id, snippet } = video;
  const classes = useStyles();
  const [videoDetail, setVideoDetail] = React.useState({
    statistics: {},
    contentDetails: {},
    snippet: snippet,
  });
  const [vote, setVote] = React.useState({
    upvote: false,
    downvote: false,
  });

  React.useEffect(() => {
    console.log(videoDetail);
  }, [videoDetail]);
  let mounted = React.useRef(false);
  let CancelToken = React.useRef(null);
  React.useEffect(() => {
    CancelToken.current = axios.CancelToken.source();
    mounted.current = true;
    return function cancel() {
      mounted.current = false;
      CancelToken.current.cancel(
        "axios request for selected video cancelled as component will unmount"
      );
    };
  }, []);
  React.useEffect(() => {
    (async (id) => {
      try {
        let res = await youtubeVideoDetailAPI.get("/videos", {
          cancelToken: CancelToken.current.token,
          params: {
            part: "contentDetails,statistics",
            id: `${id}`,
          },
        });
        if (mounted.current) {
          setVideoDetail(() => ({
            statistics: res.data.items[0].statistics,
            contentDetails: res.data.items[0].contentDetails,
            snippet: res.data.items[0].snippet,
          }));
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            " Axios Request canceled to find selected video",
            error.message
          );
          // throw new Error("Cancelled");
        }
      }
    })(id.videoId);
  }, [id.videoId]);

  function handleTagClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  function onClickVoteHandler(event) {
    let upvoteValue = 0;
    let downvoteValue = 0;
    if (event.currentTarget.id === "upvote") {
      upvoteValue = vote.upvote ? -1 : 1;
      if (vote.downvote) {
        downvoteValue = -1;
      }
      setVote((oldValue) => ({
        upvote: !oldValue.upvote,
        downvote: false,
      }));
    } else {
      downvoteValue = vote.downvote ? -1 : 1;
      if (vote.upvote) {
        upvoteValue = -1;
      }
      setVote((oldValue) => ({
        upvote: false,
        downvote: !oldValue.downvote,
      }));
    }
    setVideoDetail((oldValue) => {
      let newValue = { ...oldValue };
      let newStats = {
        ...oldValue.statistics,
        likeCount: (
          Number(oldValue.statistics.likeCount) + upvoteValue
        ).toString(),
        dislikeCount: (
          Number(oldValue.statistics.dislikeCount) + downvoteValue
        ).toString(),
      };
      newValue.statistics = newStats;
      return newValue;
    });
  }
  return (
    <Card className={classes.videoDetail}>
      <CardMedia
        component="iframe"
        alt={id.kind.split("#")}
        src={`https://www.youtube.com/embed/${id.videoId}`}
        title={videoDetail.snippet.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={classes.videoPlayer}
      />
      <CardContent className={classes.videoContent}>
        <Breadcrumbs aria-label="video tags" separator="">
          {videoDetail.snippet.tags &&
            videoDetail.snippet.tags.map((tag) => (
              <Link
                href="/"
                color="textSecondary"
                key={tag}
                onClick={handleTagClick}
              >
                {`#${tag}`}
              </Link>
            ))}
        </Breadcrumbs>
        <Typography gutterBottom variant="h5" component="h2">
          {videoDetail.snippet.title}
        </Typography>
        <div className={classes.videoStat}>
          <Typography variant="body2" color="textSecondary" component="p">
            {`${
              !isSmallScreen
                ? convertToInternationalCurrencySystem(
                    videoDetail.statistics.viewCount
                  )
                : numberWithCommas(videoDetail.statistics.viewCount)
            } views . ${
              !isSmallScreen
                ? DateConvertor(snippet.publishedAt, true)
                : DateConvertor(snippet.publishedAt, false)
            }`}
          </Typography>
          <div className={classes.voteBox}>
            <button
              className={classes.voteButton}
              id="upvote"
              onClick={onClickVoteHandler}
            >
              <ThumbUpAltIcon
                className={classes.vote}
                style={vote.upvote ? { color: "#0275d8" } : {}}
              />
            </button>
            <Typography variant="body2" color="textSecondary" component="span">
              {convertToInternationalCurrencySystem(
                videoDetail.statistics.likeCount
              )}
            </Typography>
            <button
              className={classes.voteButton}
              id="downvote"
              onClick={onClickVoteHandler}
            >
              <ThumbDownAltIcon
                className={classes.vote}
                style={vote.downvote ? { color: "#0275d8" } : {}}
              />
            </button>
            <Typography variant="body2" color="textSecondary" component="span">
              {convertToInternationalCurrencySystem(
                videoDetail.statistics.dislikeCount
              )}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
