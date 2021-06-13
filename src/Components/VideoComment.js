import React from "react";
import { decodeHtml } from "../util";
import Linkify from "react-linkify";
import { timeSince } from "../util";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  commentHeader: {
    display: "flex",
    alignItems: "center",
  },
  commentBox: {
    display: "flex",
    margin: "10px 0",
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
  readMoreButton: {
    width: "100px",
    position: "relative",
    right: "1%",
    "&:hover": {
      background: "none",
    },
  },
}));
function VideoComment({ comment }) {
  let classes = useStyles();
  const [readMore, setReadMore] = React.useState(false);
  let readMoreLimit = 250;
  let shouldReadMore =
    comment.snippet.topLevelComment.snippet.textDisplay.length > readMoreLimit;
  
  return (
    <div className={classes.commentBox}>
      <Avatar
        alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
        src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
      ></Avatar>
      <div className={classes.commentContent}>
        <div className={classes.authorDetails}>
          <Typography variant="body2" className={classes.authorName}>
            {comment.snippet.topLevelComment.snippet.authorDisplayName}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.commentDate}
          >
            {timeSince(
              Date.parse(comment.snippet.topLevelComment.snippet.publishedAt)
            )}
          </Typography>
        </div>
        <Linkify>
          <Typography>
            {decodeHtml(
              readMore
                ? comment.snippet.topLevelComment.snippet.textDisplay
                : comment.snippet.topLevelComment.snippet.textDisplay.slice(
                    0,
                    readMoreLimit
                  )
            )}
          </Typography>

          {shouldReadMore && (
            <Button
              disableRipple={true}
              className={classes.readMoreButton}
              onClick={() => setReadMore((oldValue) => !oldValue)}
            >
              {readMore ? "READ LESS" : "READ MORE"}
            </Button>
          )}
        </Linkify>
        <div>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default VideoComment;
