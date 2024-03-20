import { Form, Row, Col, Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import {toast} from 'react-toastify';

function LoginScreen() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const [login, {isLoading}] = useLoginMutation();
  const {userInfo} = useSelector(state => state.auth);

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate])

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await login({email, password}).unwrap();
      dispatch(setCredentials({...response}));
      navigate(redirect);

    } catch (error) {
      toast.error(error?.data.message || error?.error);
    }
  }

  return <FormContainer>
    <h1>Sign In</h1>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='email' className='my-3'>
        <Form.Label>Email Address</Form.Label>
        <Form.Control type='email' placeholder='Enter email' value={email} onChange={handleChange}>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId='password' className='my-3'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' placeholder='Enter password' value={password} onChange={handleChange}>
        </Form.Control>
      </Form.Group>
      <Button className='mt-2' type='submit' variant='primary' disabled={isLoading}>{isLoading ? 'Processing...': 'Submit'}</Button>

      {isLoading && <Loader />}
      <Row className='py-3'>
          <Col>New Customer ? <Link to={redirect ? `/register?redirect=${redirect}`: '/register' }>Register</Link></Col>
      </Row>
    </Form>
  </FormContainer>
}

export default LoginScreen;