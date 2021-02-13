import React from "react";
import { Container } from "react-bootstrap";
import { Register } from "./pages";
import { ApolloProvider } from "./Apollo";

import "./App.scss";

function App() {
  return (
    <ApolloProvider>
      <Container className="pt-5">
        <Register />
      </Container>
    </ApolloProvider>
  );
}

export default App;
