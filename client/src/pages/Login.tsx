import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      userName
      email
      createdAt
      token
    }
  }
`;

export default function Register(props: any) {
  const [variables, setVariables] = useState({
    password: "",
    userName: "",
  });

  const [errors, setErrors]: any = useState({});

  const dispatch: any = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err: any) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data: any) => {
      dispatch({ type: "LOGIN", payload: data.login });
      props.history.push("/");
    },
  });

  const submitLoginForm = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    loginUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={4} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={errors.userName && "text-danger"}>
              {errors.userName ?? "Username"}
            </Form.Label>
            <Form.Control
              type="text"
              value={variables.userName}
              className={errors.userName && "is-invalid"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({ ...variables, userName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              className={errors.password && "is-invalid"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Login"}
            </Button>
            <br />
            <small>
              Don't have an account <Link to="/register">Register🚀</Link>{" "}
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
