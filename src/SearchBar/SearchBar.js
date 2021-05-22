import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextFieldsOutlinedIcon from "@material-ui/icons/TextFieldsOutlined";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  static defaultProps = {
    id: "textfield",
    label: "text-input",
    helperText: "",
    ariaLabel: "text-input",
    align: "start",
    icon: <TextFieldsOutlinedIcon />,
    autoComplete: "false",
    autoCorrect: "false",
    required: false,
    fullWidth: false,
    placeholder: ""
  };
  render() {
    const {
      id,
      label,
      helperText,
      ariaLabel,
      align,
      icon,
      autoCorrect,
      autoComplete,
      required,
      fullWidth,
      placeholder
    } = this.props;
    return (
      <TextField
        id={id}
        label={label}
        helperText={helperText}
        type="text"
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        required={required}
        aria-label={ariaLabel}
        fullWidth={fullWidth}
        color="info"
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position={align}>{icon}</InputAdornment>
          ),
        }}
      />
    );
  }
}
