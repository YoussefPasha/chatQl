import React from "react";
import { Button, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useAuthDispatch } from "../context/auth";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      userName
      email
      createdAt
    }
  }
`;

export default function Home() {
  const dispatch: any = useAuthDispatch();
  const history = useHistory();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }
  return (
    <Row className="bg-white justify-content-around">
      <Link to="/login">
        <Button variant="link">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="link">Register</Button>
      </Link>
      <Button variant="link" onClick={logout}>
        Logout
      </Button>
    </Row>
  );
}
