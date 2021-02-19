import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";
import { ApolloProvider } from "./Apollo";
import { Register, Home, Login } from "./pages";
import { AuthProvider } from "./context/auth";
import DynamicRoute from "./util/dynamicRoute";

import "./App.scss";

function App() {
  return (
    <AuthProvider>
      <ApolloProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <DynamicRoute path="/" component={Home} exact authenticated />
              <DynamicRoute path="/register" component={Register} guest />
              <DynamicRoute path="/login" component={Login} guest />
            </Switch>
          </Container>
        </BrowserRouter>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
