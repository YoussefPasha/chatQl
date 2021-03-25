import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { useAuthDispatch } from "../context/auth";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      userName
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export default function Home({ history }: any) {
  const dispatch: any = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };
  const { loading, data, error } = useQuery(GET_USERS);

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) {
    console.log(messagesData);
  }

  let userMarkups;
  if (!data || loading) {
    userMarkups = <p> Loading...</p>;
  } else if (data.getUsers.length === 0) {
    userMarkups = <p> There is no users</p>;
  } else if (data.getUsers.length > 0) {
    userMarkups = data.getUsers.map((user: any) => (
      <div
        className="d-flex p-3"
        key={user.userName}
        onClick={() => setSelectedUser(user.userName)}
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
        <div>
          <p className="text-success">{user.userName}</p>
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are noe connected"}
          </p>
        </div>
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
        <Col xs={4} className="p-0 bg-secondary">
          {userMarkups}
        </Col>
        <Col xs={4}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((message: any) => (
              <p key={message.uuid}> {message.content} </p>
            ))
          ) : (
            <p>Messages</p>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
