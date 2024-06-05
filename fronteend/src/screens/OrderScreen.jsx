import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from '../slices/orderApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function OrderScreen() {

  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading:isOrderLoading, error:errorLoadingOrder } = useGetOrderDetailsQuery(orderId);
  // Remember queries return objects, in this case, we destructuring an object whose first property is called data
  // That's why the first variable is called data and we renamed it order to be more precise.

    // The 'data' variable destructured from the query result represents the fetched order details.
  // We chose to alias it as 'order' for clarity. Alternatively, we could have directly named it 'order'.

  const { data: paypalClientId, isLoading: isPayPalClientIdLoading, error: errorPayPalClientId } = useGetPayPalClientIdQuery(); // object desctructuring because the function call returns an object (The type is a query in this case, queries returns objects)

  const [payOrder, { isLoading: isPayOrderLoading }] = usePayOrderMutation(); // array destructuring because the function call retunrs an array. mutations return arrays 
  const [deliverOrder, {isLoading: isDeliverOrderLoading }] = useDeliverOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer(); // same as above
  const { userInfo } = useSelector(state => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder({orderId});
      refetch();
      toast.success('order delivered');

    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  useEffect(() => {
    if (!isPayPalClientIdLoading && !errorPayPalClientId && paypalClientId.clientId) {
      // We are checking here if there is no error after the function is called,
      // if the loading of the function is complete (isPayPalClientIdLoading is false),
      // and if data (paypal) contains the (clientId)

      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypalClientId.clientId,
            'currency': 'USD'
          }
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }

      // We want to ensure that the PayPal script is only loaded when an unpaid order exists, indicating that the user may proceed to make a payment.
      if (order && !order.isPaid) {
        if (!window.paypalClientId) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypalClientId, paypalDispatch, isPayPalClientIdLoading, errorPayPalClientId]);

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {amount : {
          value: order.totalPrice,
        },
      },
      ]
    }).then( (orderId) => {return orderId} ) 
   };
   
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {          
        await payOrder({ orderId, details}).unwrap();
        refetch();
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  };

  // async function onApproveTest() {
  //   await payOrder({orderId, details: { payer: {}} });
  //   refetch();
  //   toast.success('Payment successful');
  // };

  function onError(err) {
    toast.error(err?.data?.message || err.message);
   };


  return isOrderLoading ? <Loader /> : errorLoadingOrder ? <Message variant='danger'>{errorLoadingOrder?.data?.message || errorLoadingOrder.error}</Message> :
    (
      <>
        <h1>Order: {order._id}</h1>
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
                  <h2>Order Summary</h2>
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
                    {isPayOrderLoading && <Loader />}

                    {isPending ? <Loader /> :
                      <div>
                        {/* <Button onClick={ onApproveTest } style={{ marginBottom: '10px' }}>
                          Test Pay Order
                        </Button> */}
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
                {
                  userInfo && userInfo.isAdmin && order.isPaid && ! order.isDelivered && (
                    <ListGroup.Item>
                      <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>Mark Order As Delivered</Button>
                    </ListGroup.Item>
                  )
                }
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    );
}

export default OrderScreen;