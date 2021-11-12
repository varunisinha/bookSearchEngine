import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Button, Alert } from 'react-bootstrap';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [user_data, setuserData] = useState({ email: '', password: '' });
  const [login] = useMutation(LOGIN_USER);
  const [validation] = useState(false);
  const [display_Alert, alertDisplay] = useState(false);
  const updateValue = (event) => {
    const { name, value } = event.target;
    setuserData({ ...user_data, [name]: value });
  };

  const clickOnSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...user_data }
      });
    

      Auth.login(data.login.token);

    } catch (e) {
      console.error(e);
      alertDisplay(true);
    }

    setuserData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validation={validation} onSubmit={clickOnSubmit}>
        <Alert dismissible onClose={() => alertDisplay(false)} show={display_Alert} variant='danger'>
          Something went wrong. Please check your email and password!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            name='email'
            onChange={updateValue}
            value={user_data.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            onChange={updateValue}
            value={user_data.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(user_data.email && user_data.password)}
          type='submit'
          className='app-button btn-block'
          variant='normal'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
