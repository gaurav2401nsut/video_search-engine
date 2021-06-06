import React from "react";
import youtubeAPI from "./axios-instance";
import SearchBar from "./Components/SearchBar";
import VideoList from "./Components/VideoList";
import VideoDetail from "./Components/VideoDetail";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { withStyles } from "@material-ui/core/styles";
const styles = (theme) => ({
  appContent: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  },
  appContainer: {
    [theme.breakpoints.up("lg")]: {
      maxWidth: "95vw !important",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  searchBar: {
    [theme.breakpoints.up("lg")]: {
      maxWidth: "40vw",
      marginBottom: "3vh",
    },
  },
});
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoItems: [],
      skeletonDisplay: true,
      selectedVideo: null,
    };
  }
  componentDidMount() {
    (async () => {
      let response = await youtubeAPI.get("/search", {
        params: {
          relatedToVideoId: "7ghhRHRP6t4",
          part: "snippet,id",
          maxResults: "50",
          order: "relevance",
          regionCode: "US",
        },
      });
      let videos = response.data.items;
      videos = videos.filter(video=>(video.hasOwnProperty("snippet")))
      response.data.items = videos;
      this.setState({videoItems:response.data})
    })();
  }
  searchTextHandler = async (searchTextValue) => {
    this.setState({
      videoItems: [],
      skeletonDisplay: true,
      selectedVideo: null,
    });
    let response = await youtubeAPI.get("/search", {
      params: {
        q: searchTextValue,
        part: "snippet,id",
        maxResults: "50",
        order: "relevance",
        regionCode: "US",
      },
    });
    console.log(response);
    this.setState({ videoItems: response.data });
  };
  selectedVideoHandler = (video) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let checkScrollEnd =()=> {
      if (
        (window.scrollY ||
          document.body.scrollTop ||
          document.documentElement.scrollTop) !== 0
      ) {
        window.requestAnimationFrame(checkScrollEnd);
      } else {
        this.setState({ selectedVideo: video }, () => {
          console.log(this.state.selectedVideo);
        });
      }
    }

    window.requestAnimationFrame(checkScrollEnd);
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.appContainer}>
        <SearchBar
          id="video-search-text"
          placeholder="Search Video"
          arial-label="video-search-text"
          icon={<SearchOutlinedIcon />}
          align="end"
          fullWidth={true}
          setSearchText={this.searchTextHandler}
          className={classes.searchBar}
        />
        <Box className={classes.appContent}>
          {this.state.selectedVideo && (
            <VideoDetail video={this.state.selectedVideo} />
          )}
          {this.state.skeletonDisplay && (
            <VideoList
              videoItems={this.state.videoItems}
              selectedVideoHandler={this.selectedVideoHandler}
              selectedVideo={this.state.selectedVideo}
            />
          )}
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(App);
