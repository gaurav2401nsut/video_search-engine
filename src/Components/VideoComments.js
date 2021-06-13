import React from "react";
import youtubeAPI from "../axios-instance";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { numberWithCommas } from "../util";
import SortIcon from "@material-ui/icons/Sort";
import VideoComment from "./VideoComment";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
const useStyles = makeStyles((theme) => ({
  commentList: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
  },
  commentBox: {
    display: "flex",
    margin: "10px 0",
  },
  sortButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "110px",
    height: "30px",
    marginLeft: "20px",
    cursor: "pointer",
    color: theme.palette.text.secondary,
    "&>P": {
      marginLeft: "10px",
    },
  },
  commentContent: {
    display: "flex",
    marginLeft: "10px",
    flexDirection: "column",
  },
  authorName: {
    fontWeight: "400",
  },
  authorDetails: {
    display: "flex",
    alignItems: "center",
  },
  commentDate: {
    marginLeft: "5px",
  },
}));
function VideoComments(props) {
  const { id } = props;
  let classes = useStyles();
  const [comments, setComments] = React.useState({});
  let theme = useTheme();
  let isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  let commentsArray =
    comments.items &&
    comments.items.map((comment) => (
      <VideoComment comment={comment} key={comment.id} />
    ));
  const [showMore, setShowMore] = React.useState(false);
  React.useEffect(() => {
    (async (id) => {
      let response = await youtubeAPI.get("/commentThreads", {
        params: { part: "snippet", videoId: id, maxResults: "50" },
      });
      console.log(response);
      setComments(() => response.data);
    })(id);
  }, [id]);
  return (
    <div className={classes.commentList}>
      <div className={classes.commentHeader}>
        <Typography variant="body1" color="textSecondary">
          {`${
            comments.pageInfo
              ? numberWithCommas(
                  comments.pageInfo.totalResults *
                    comments.pageInfo.resultsPerPage
                )
              : "0"
          } Comments`}
        </Typography>
        <span className={classes.sortButton}>
          <SortIcon />
          <Typography variant="body1" color="textSecondary">
            SORT BY
          </Typography>
        </span>
      </div>
      {!isSmallScreen || showMore ? commentsArray : commentsArray.slice(0, 3)}
      {isSmallScreen && (
        <Button onClick={() => setShowMore((oldValue) => !oldValue)}>
          {showMore ? "SHOW LESS" : "SHOW MORE"}
        </Button>
      )}
    </div>
  );
}

export default VideoComments;
