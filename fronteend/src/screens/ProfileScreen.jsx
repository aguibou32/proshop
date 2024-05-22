import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useUpdateUserProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { FaTimes } from 'react-icons/fa';

function ProfileScreen() {

  const dispatch = useDispatch();

  const { userInfo } = useSelector(state => state.auth);

  // console.log(useUpdateUserProfileMutation());

  const [updateUserProfile, { isLoading: isUpdateUserProfileLoading }] = useUpdateUserProfileMutation();
  const { data: myOrders, isLoading: isMyOrdersLoading, error } = useGetMyOrdersQuery();

  const [formData, setFormData] = useState(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  );
  const { name, email, password, confirmPassword } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('password do not match');
    } else {
      try {
        const response = await updateUserProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials({ ...response }));

        toast.success('Profile updated');
      } catch (error) {
        toast.error(error?.data.message || error?.error);
      }
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [userInfo.name, userInfo.email]);

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={handleSubmit}>

          <FormGroup controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={handleChange}>
            </Form.Control>
          </FormGroup>

          <FormGroup controlId='email' className='my-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={handleChange}>
            </Form.Control>
          </FormGroup>

          <FormGroup controlId='password' className='my-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={handleChange}>
            </Form.Control>
          </FormGroup>

          <FormGroup controlId='confirmPassword' className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={handleChange}>
            </Form.Control>
          </FormGroup>

          <Button className='mt-2' type='submit' variant='primary' disabled={isUpdateUserProfileLoading}>{isUpdateUserProfileLoading ? 'Processing...' : 'Submit'}</Button>

          {isUpdateUserProfileLoading && <Loader />}

        </Form>
      </Col>
      <Col md={9}>
        <h2>My orders</h2>
        {
          isMyOrdersLoading ? <Loader /> : error ? <Message variant='danger'> {error?.data.message || error?.error}</Message> : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL ($)</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                    <td>{order.isDelivered ? order.isDelivered.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                    <td>
                      <LinkContainer to={`/orders/${order._id}`}> 
                        <Button className='btn-sm' variant='light'>Details</Button> 
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        }
      </Col>
    </Row>
  )
}

export default ProfileScreen;