import React from "react";
import { decodeHtml } from "../util";
import Linkify from "react-linkify";
import { timeSince } from "../util";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { ThumbDownAlt, ThumbUpAlt } from "@material-ui/icons";
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
  voteWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: "5px",
  },
  vote: {
    color: theme.palette.text.disabled,
    fontSize: "calc(14px + 0.2vh + 0.2vw)",
  },
  likeCount: {
    margin: "auto 10px auto 4px",
  },
  voteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
}));
function VideoComment({ comment, loading }) {
  let classes = useStyles();
  const [readMore, setReadMore] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(
    comment.snippet.topLevelComment.snippet.likeCount
  );
  const [voteValue, setVoteValue] = React.useState(0);
  let readMoreLimit = 250;
  let shouldReadMore =
    comment.snippet.topLevelComment.snippet.textDisplay.length > readMoreLimit;
  function onClickVoteHandler(event) {
    if (event.currentTarget.id === "upvote") {
      setVoteValue((oldValue) => (oldValue === 1 ? 0 : 1));
    } else {
      setVoteValue((oldValue) => (oldValue === -1 ? 0 : -1));
    }
  }
  React.useEffect(() => {
    setLikeCount(() => {
      if (voteValue === 1)
        return comment.snippet.topLevelComment.snippet.likeCount + 1;
      else return comment.snippet.topLevelComment.snippet.likeCount;
    });
  }, [voteValue, comment]);
  return (
    <div className={classes.commentBox}>
      <Avatar
        loading={loading}
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
            {comment.snippet.topLevelComment.snippet.publishedAt ===
            comment.snippet.topLevelComment.snippet.updatedAt
              ? timeSince(
                  Date.parse(
                    comment.snippet.topLevelComment.snippet.publishedAt
                  )
                ) + " ago"
              : timeSince(
                  Date.parse(comment.snippet.topLevelComment.snippet.updatedAt)
                ) + " ago (edited)"}
          </Typography>
        </div>
        <Linkify>
          <Typography
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              wordBreak: "break-all",
              maxWidth: "100%",
            }}
          >
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
        <div className={classes.voteWrapper}>
          <span
            className={classes.voteButton}
            onClick={(event) => onClickVoteHandler(event)}
            id="upvote"
          >
            <ThumbUpAlt
              className={classes.vote}
              style={voteValue === 1 ? { color: "#0275d8" } : {}}
            />
          </span>
          <Typography
            className={classes.likeCount}
            variant="caption"
            color="textSecondary"
          >
            {likeCount}
          </Typography>
          <span
            className={classes.voteButton}
            onClick={(event) => onClickVoteHandler(event)}
            id="downvote"
          >
            <ThumbDownAlt
              className={classes.vote}
              style={voteValue === -1 ? { color: "#0275d8" } : {}}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoComment;
