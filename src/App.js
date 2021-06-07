import React from "react";
import youtubeAPI from "./axios-instance";
import SearchBar from "./Components/SearchBar";
import VideoList from "./Components/VideoList";
import VideoDetail from "./Components/VideoDetail";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import axios from "axios";
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
  cancelAxiosRequestToken = axios.CancelToken.source();
  componentDidMount() {
    this.mounted = true;
    (async () => {
      try {
        let response = await youtubeAPI.get("/search", {
          cancelToken: this.cancelAxiosRequestToken.token,
          params: {
            relatedToVideoId: "7ghhRHRP6t4",
            part: "snippet,id",
            maxResults: "50",
            order: "relevance",
            regionCode: "US",
          },
        });
        let videos = response.data.items;
        videos = videos.filter((video) => video.hasOwnProperty("snippet"));
        response.data.items = videos;
        if (this.mounted) this.setState({ videoItems: response.data });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(
            " Axios Request canceled to find video related to user preference",
            error.message
          );
          // throw new Error("Cancelled");
        }
      }
    })();
  }
  searchTextHandler = async (searchTextValue) => {
    this.setState({
      videoItems: [],
      skeletonDisplay: true,
      selectedVideo: null,
    });
    try {
      let response = await youtubeAPI.get("/search", {
        cancelToken: this.cancelAxiosRequestToken.token,

        params: {
          q: searchTextValue,
          part: "snippet,id",
          maxResults: "50",
          order: "relevance",
          regionCode: "US",
        },
      });
      console.log(response);
      if (this.mounted) this.setState({ videoItems: response.data });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          " Axios Request canceled to search videos on some query",
          error.message
        );
        // throw new Error("Cancelled");
      }
    }
  };
  selectedVideoHandler = (video) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let checkScrollEnd = () => {
      if (
        (window.scrollY ||
          document.body.scrollTop ||
          document.documentElement.scrollTop) !== 0
      ) {
        window.requestAnimationFrame(checkScrollEnd);
      } else {
        if (this.mounted) this.setState({ selectedVideo: video });
      }
    };

    window.requestAnimationFrame(checkScrollEnd);
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };
  componentWillUnmount() {
    this.mounted = false;
    this.cancelAxiosRequestToken.cancel(
      "Axios request cancelled as component is going to unmount"
    );
  }
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
