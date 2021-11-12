import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Button, Alert } from 'react-bootstrap';

import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [user_data, setuserData] = useState({ username: '', email: '', password: '' });
  const [validation] = useState(false);
  const [display_Alert, alertDisplay] = useState(false);

  const [addUser] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { ...user_data }
      });
   
      Auth.login(data.addUser.token);

    } catch (err) {
      console.error(err);
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
          Something went wrong!
        </Alert>

        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            name='username'
            onChange={updateValue}
            value={user_data.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
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
          disabled={!(user_data.username && user_data.email && user_data.password)}
          type='submit' className='app-button btn-block'
          variant='normal'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
