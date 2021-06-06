import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import TextFieldsOutlinedIcon from "@material-ui/icons/TextFieldsOutlined";
import { lightBlue } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { searchText: "" };
  }
  theme = createMuiTheme({
    palette: {
      primary: lightBlue,
      secondary: {
        main: "#d9534f",
      },
    },
    typography: {
      fontSize: 18,
    },
  });
  static defaultProps = {
    id: "textfield",
    label: "",
    helperText: "",
    "aria-label": "text-input",
    align: "start",
    icon: <TextFieldsOutlinedIcon />,
    autoComplete: "false",
    autoCorrect: "false",
    fullWidth: false,
    placeholder: "",
  };
  textFieldChangeHandler = (event) => {
    if (event.key) {
      if (event.key === "Enter") {
        this.setState({ searchText: event.target.value }, () => {
          this.props.setSearchText(this.state.searchText);
          this.setState({ searchText: "" });
        });
      }
    } else {
      this.setState({ searchText: event.target.value });
    }
  };
  onSearchClickHandler = (event) => {
    this.props.setSearchText(this.state.searchText);
    this.setState({ searchText: "" });
  };
  render() {
    const { setSearchText, align, icon, ...attributes } = this.props;
    return (
      <ThemeProvider theme={this.theme}>
        <TextField
          {...attributes}
          color="secondary"
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position={align}>
                <IconButton
                  color="secondary"
                  onClick={this.onSearchClickHandler}
                >
                  {icon}
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={this.state.searchText}
          onChange={this.textFieldChangeHandler}
          onKeyPress={this.textFieldChangeHandler}
        />
      </ThemeProvider>
    );
  }
}
