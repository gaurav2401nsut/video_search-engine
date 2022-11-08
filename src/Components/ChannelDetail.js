import React from "react";
import youtubeAPI from "../axios-instance";
import Divider from "@material-ui/core/Divider";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { convertToInternationalCurrencySystem } from "../util";
import { Button, ThemeProvider, Typography } from "@material-ui/core";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  dividerLine: {
    marginTop: "5px",
  },
  channelDetailBox: {
    display: "flex",
    margin: "10px 0",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  channelNameAndSubscribeCount: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10px",
  },
  channelDetail: {
    display: "flex",
  },
  subscribeButton: {
    padding: "6px 18px",
  },
  notificationButton: {
    width: "5px",
    "&:hover": {
      background: "none",
    },
  },
}));
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#cc0000",
    },
  },
});
function ChannelDetail(props) {
  let classes = useStyles();
  const { id } = props;
  const [channelDetail, setChannelDetail] = React.useState({});
  const [isSubscribed, setSubscribed] = React.useState(false);
  const [isNotified, setNotified] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState([]);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
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
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpenSnackBar(true);
    } else if (snackPack.length && messageInfo && openSnackBar) {
      // Close an active snack when a new one is added
      setOpenSnackBar(false);
    }
  }, [snackPack, messageInfo, openSnackBar]);
  const snackHandleExited = () => {
    setMessageInfo(undefined);
  };

  function onClickNotification() {
    setNotified((oldValue) => {
      setSnackPack((prev) => [
        ...prev,
        {
          message:
            (oldValue ? "You will not" : "You will") +
            ` recieve notifications from channel ${channelDetail.snippet.title}`,
          key: new Date().getTime(),
        },
      ]);
      return !oldValue;
    });
  }

  function onClickSubscribeHandler() {
    setSubscribed((oldSuscribeValue) => {
      setChannelDetail((oldValue) => {
        let newValue = { ...oldValue };
        let subscriberCount =
          Number(oldValue.statistics.subscriberCount) +
          Number(oldSuscribeValue ? -1 : 1);
        subscriberCount = subscriberCount.toString();
        let stats = { ...oldValue.statistics, subscriberCount };
        newValue.statistics = stats;
        return newValue;
      });
      return !oldSuscribeValue;
    });
  }
  React.useEffect(() => {
    try {
      setSubscribed(() => false);
      setNotified(() => false);
      setNotified(() => false);
      (async (id) => {
        let response = await youtubeAPI.get("/channels", {
          cancelToken: CancelToken.current.token,
          params: {
            part: "snippet,statistics",
            id: id,
          },
        });
        if (mounted.current && response !== undefined) {
          setChannelDetail(() => {
            return response.data.items[0];
          });
        }
      })(id);
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
  }, [id]);
  return (
    <>
      <Divider className={classes.dividerLine} />
      {channelDetail.hasOwnProperty("snippet") && (
        <div className={classes.channelDetailBox}>
          <div className={classes.channelDetail}>
            <Avatar
              alt={channelDetail.snippet.title}
              src={channelDetail.snippet.thumbnails.default.url}
            />
            <div className={classes.channelNameAndSubscribeCount}>
              <Typography variant="body2">
                {channelDetail.snippet.title}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {convertToInternationalCurrencySystem(
                  channelDetail.statistics.subscriberCount
                )}
              </Typography>
            </div>
          </div>
          <span>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color={isSubscribed ? "default" : "primary"}
                style={
                  isSubscribed ? { color: theme.palette.text.secondary } : {}
                }
                className={classes.subscribeButton}
                onClick={onClickSubscribeHandler}
              >
                {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
              </Button>
              {isSubscribed && (
                <Button
                  className={classes.notificationButton}
                  variant="text"
                  disableRipple={true}
                  onClick={onClickNotification}
                >
                  {isNotified ? (
                    <NotificationsActiveIcon
                      style={{ color: theme.palette.text.secondary }}
                    />
                  ) : (
                    <NotificationsNoneIcon
                      style={{ color: theme.palette.text.secondary }}
                    />
                  )}
                </Button>
              )}
            </ThemeProvider>
          </span>
          <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            onClose={() => setOpenSnackBar(() => false)}
            open={openSnackBar}
            autoHideDuration={3000}
            message={messageInfo ? messageInfo.message : undefined}
            onExited={snackHandleExited}
          />
        </div>
      )}
    </>
  );
}

export default ChannelDetail;
