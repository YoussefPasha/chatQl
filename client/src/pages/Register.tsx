import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const REGISTER_USER = gql`
  mutation register(
    $userName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      userName: $userName
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      userName
      email
      createdAt
    }
  }
`;

export default function Register(props: any) {
  const [variables, setVariables] = useState({
    email: "",
    password: "",
    userName: "",
    confirmPassword: "",
  });

  const [errors, setErrors]: any = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => props.history.push("/login"),
    onError: (err: any) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const submitRegisterForm = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    registerUser({ variables });
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={4} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && "text-danger"}>
              {errors.email ?? "Email address"}
            </Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              className={errors.email && "is-invalid"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
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
          <Form.Group>
            <Form.Label className={errors.confirmPassword && "text-danger"}>
              {errors.confirmPassword ?? "Confirm Password"}
            </Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              className={errors.confirmPassword && "is-invalid"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Register"}
            </Button>
            <br />
            <small>
              already have an account <Link to="/login">Login🚀</Link>{" "}
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
