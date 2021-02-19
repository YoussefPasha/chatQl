import React, { Fragment } from "react";
import { Button, Col, Row } from "react-bootstrap";
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

  let userMarkups;
  if (!data || loading) {
    userMarkups = <p> Loading...</p>;
  } else if (data.getUsers.length === 0) {
    userMarkups = <p> There is no users</p>;
  } else if (data.getUsers.length > 0) {
    userMarkups = data.getUsers.map((user: any) => (
      <div key={user.userName}>
        <p>{user.userName}</p>
      </div>
    ));
  }
  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
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
      <Row className="bg-white  ">
        <Col xs={4}>{userMarkups}</Col>
        <Col xs={4}>
          <p>Messages</p>
        </Col>
      </Row>
    </Fragment>
  );
}
