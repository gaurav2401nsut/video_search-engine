import React from "react";
import SearchBar from "./SearchBar/SearchBar";
import Container from "@material-ui/core/Container";
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container>
        <SearchBar />
      </Container>
    );
  }
}

export default App;
