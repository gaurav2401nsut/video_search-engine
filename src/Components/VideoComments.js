import React from "react";
import youtubeAPI from "../axios-instance";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { numberWithCommas } from "../util";
import SortIcon from "@material-ui/icons/Sort";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
const VideoComment = React.lazy(() => import("./VideoComment"));
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
  let commentsArray = [];

  comments.items &&
    comments.items.forEach((comment) =>
      commentsArray.push(
        <React.Suspense fallback={<></>} key={comment.id}>
          <VideoComment
            comment={comment}
          />
        </React.Suspense>
      )
    );
  const [showMore, setShowMore] = React.useState(false);
  let mounted = React.useRef(false);
  let CancelToken = React.useRef(null);
  React.useEffect(() => {
    mounted.current = true;
    CancelToken.current = axios.CancelToken.source();
    return function () {
      mounted.current = false;
      CancelToken.current.cancel(
        "axios request for selected video cancelled as component will unmount"
      );
    };
  }, []);
  React.useEffect(() => {
    (async (id) => {
      try {
        let response = await youtubeAPI.get("/commentThreads", {
          cancelToken: CancelToken.current.token,
          params: { part: "snippet", videoId: id, maxResults: "20" },
        });
        if (mounted.current && response !== undefined) {
          console.log(response);
          setComments(() => response.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            " Axios Request canceled to find selected video",
            error.message
          );
          return;
        }
        console.log(error);
      }
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
        <span className={classes.sortButton} >
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
