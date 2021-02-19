import React from "react";
import { Redirect, Route } from "react-router";
import { useAuthState } from "../context/auth";

export default function DynamicRoute(props: any) {
  const state = useAuthState();
  const { user }: any = state;

  if (props.authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else {
    return <Route component={props.component} {...props} />;
  }
}
