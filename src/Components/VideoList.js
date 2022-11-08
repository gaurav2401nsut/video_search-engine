import React from "react";
import VideoItem from "./VideoItem";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { trackWindowScroll } from "react-lazy-load-image-component";
const styles = (theme) => ({
  videoList: {
    [theme.breakpoints.up("md")]: {
      flexBasis: "360px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  },
});
class VideoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const { items = new Array(50) } = this.props.videoItems;
    let videoItems = [];
    for (let i = 0; i < items.length; i++) {
      videoItems.push(
        <VideoItem
          videoItem={items[i]}
          scrollPosition={this.props.scrollPosition}
          key={
            items[i]
              ? items[i].id.videoId
                ? items[i].id.videoId
                : items[i].id.channelId
              : i + "789"
          }
          selectedVideoHandler={this.props.selectedVideoHandler}
          selectedVideo={this.props.selectedVideo}
        />
      );
    }
    return (
      <Grid
        className={this.props.selectedVideo ? classes.videoList : ""}
        container
        spacing={2}
        justify="space-evenly"
      >
        {videoItems}
      </Grid>
    );
  }
}
export default withStyles(styles)(trackWindowScroll(VideoList));
