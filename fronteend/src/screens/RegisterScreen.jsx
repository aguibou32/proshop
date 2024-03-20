import { Form, Row, Col, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function RegisterScreen() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate])


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword:''
  });

  const {name, email, password, confirmPassword} = formData;
  const [register, {isLoading}] = useRegisterMutation();

  const handleChange = (e) => {
    const {id, value} = e.target;

    setFormData((prevData) => ({
      ...prevData, 
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password === confirmPassword){
      try {
        const response = await register({name, email, password}).unwrap();

        dispatch(setCredentials({...response}));
        navigate('/');
      } catch (error) {
        toast.error(error?.data.message || error?.error);
      }
    }
  }

  return <FormContainer>
    <h1>Register</h1>

    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='name' className='my-3'>
        <Form.Label>Name</Form.Label>
        <Form.Control type='text' placeholder='Enter your name' value={name} onChange={handleChange}>
        </Form.Control>
      </Form.Group>
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
      <Form.Group controlId='confirmPassword' className='my-3'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={handleChange}>
        </Form.Control>
      </Form.Group>
    <Button className='mt-2' type='submit' variant='primary' disabled={isLoading}>{isLoading ? 'Processing...': 'Submit'}</Button>

      {isLoading && <Loader />}
      <Row className='py-3'>
          <Col>Already have an account ? <Link to={redirect ? `/login?redirect=${redirect}`: '/login' }>Log in</Link></Col>
      </Row>
    </Form>
  </FormContainer>
}

export default RegisterScreen;