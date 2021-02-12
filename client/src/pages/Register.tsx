import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function Register() {
  const [variables, setVariables] = useState({
    email: "",
    password: "",
    userName: "",
    confirmPassword: "",
  });

  const submitRegisterForm = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(variables);
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={4} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={variables.userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({ ...variables, userName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
