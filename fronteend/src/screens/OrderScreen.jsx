import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from '../slices/orderApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function OrderScreen() {

  const { id: orderId } = useParams();

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery(); // object desctructuring because the function call returns an object (They type is a query in this case, queries returns objects)
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId); // same as above

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // array destructuring because the function call retunrs an array. mutations return arrays 
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer(); // same as above
  const { userInfo } = useSelector(state => state.auth);

  // The 'data' variable destructured from the query result represents the fetched order details.
  // We chose to alias it as 'order' for clarity. Alternatively, we could have directly named it 'order'.

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      // We are checking here if there is no error after the function is called,
      // if the loading of the function is complete (loadingPayPal is false),
      // and if data (paypal) contains the clientId

      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            'currency': 'USD'
          }
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details: {} });
        refetch();
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };

  async function onApproveTest() {

    await payOrder({ orderId, details: { payer: {}} });
    refetch();
    toast.success('Payment successful');
  };

  function onError(err) {
    toast.error(err.message);
   };

  function createOrder(data, actions) {
    return actions.order.create({
      purchace_units: [
        {amount : {
          value: order.totalPrice,
        },
      },
      ]
    }).then((orderId)=> orderId ) 
   };

  return isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
    (
      <>
        <h1>Order {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p><strong>Name: </strong>{order.user.name}</p>
                <p><strong>Email: </strong>{order.user.email}</p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address},
                  {order.shippingAddress.city},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (<Message variant='success'>Delivered on {order.deliveredAt}</Message>) : (<Message variant='danger'>Not delivered</Message>)}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment method</h2>
                <p>
                  <strong>Method:</strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (<Message variant='success'>Paid on {order.paidAt}</Message>) : (<Message variant='danger'>Not paid</Message>)}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} * ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summury</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Total</strong></Col>
                    <Col><strong>${order.totalPrice}</strong></Col>
                  </Row>
                </ListGroup.Item>
                {/* {PAY ORDER PLACEHOLDER} */}

                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}

                    {isPending ? <Loader /> :
                      <div>
                        <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}>
                          Test Pay Order
                        </Button>
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      </div>
                    }
                  </ListGroup.Item>
                )}
                {/* {MARK AS DELIVERED PLACEHOLDER} */}
              </ListGroup>
            </Card>

          </Col>
        </Row>
      </>
    );
}

export default OrderScreen;