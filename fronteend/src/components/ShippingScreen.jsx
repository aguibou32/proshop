import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import FormContainer from './FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from './CheckoutSteps';

const ShippingScreen = () => {

  const cart = useSelector((state) => state.cart);
  const {shippingAddress} = cart;


  const [formData, setFormData] = useState({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || ''
  });

  const { address, city, postalCode, country } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(address !=='' || city !=='' || postalCode !=='' || country !==''){
      dispatch(saveShippingAddress({address, city, postalCode, country}));
      navigate('/payment')
    }
  }


  return <FormContainer>
    <CheckoutSteps step1 step2 />

    <h1>Shipping</h1>

    <Form onSubmit={handleSubmit}>

      <Form.Group controlId='address'>
        <Form.Label>Address</Form.Label>
        <Form.Control type='text' placeholder='Enter address' value={address} name='address' onChange={handleChange} ></Form.Control>
      </Form.Group>

      <Form.Group controlId='city'>
        <Form.Label>City</Form.Label>
        <Form.Control type='text' placeholder='Enter city' value={city} name='city' onChange={handleChange} ></Form.Control>
      </Form.Group>

      <Form.Group controlId='postalCode'>
        <Form.Label>Postal Code</Form.Label>
        <Form.Control type='text' placeholder='Enter postal code' value={postalCode} name='postalCode' onChange={handleChange} ></Form.Control>
      </Form.Group>

      <Form.Group controlId='country'>
        <Form.Label>Country</Form.Label>
        <Form.Control as='select' value={country} name='country' onChange={handleChange}>
          <option value=''>Select Country</option>
          <option value='Canada'>Canada</option>
          <option value='USA'>USA</option>
        </Form.Control>
      </Form.Group>

      <Button type='submit' variant='primary' className='my-2'>
        Continue
      </Button>

    </Form>
  </FormContainer>
}

export default ShippingScreen;