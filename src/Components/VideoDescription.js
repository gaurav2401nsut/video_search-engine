import React from "react";
import Typography from "@material-ui/core/Typography";
import Linkify from "react-linkify";
import { decodeHtml } from "../util";
import { Button } from "@material-ui/core";
function VideoDescription({ text }) {
  text = decodeHtml(text);
  const [isReadMore, setReadMore] = React.useState(false);
  function toggleMore() {
    setReadMore((oldValue) => !oldValue);
  }
  let readLimit = 150;
  return (
    <Linkify>
      <Typography style={{ whiteSpace: "pre-wrap", marginLeft: "45px" }}>
        {isReadMore ? text : text.slice(0, readLimit)}
      </Typography>
      {text.length > readLimit && (
        <Button
          onClick={toggleMore}
          style={{ marginTop: "10px", marginLeft: "38px" }}
        >
          {isReadMore ? "Read Less" : "Read More"}
        </Button>
      )}
    </Linkify>
  );
}

export default VideoDescription;
