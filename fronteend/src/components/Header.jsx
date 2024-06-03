import React from 'react';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaAddressCard, FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice.js';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox.jsx';

export default function Header() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector(state => state.cart); // state.cart, cart in this case is the name of the cart state slice
  const { userInfo } = useSelector(state => state.auth);

  const [logoutApiCall] = useLogoutMutation(); // This is the logout function that we are extracting, we can name it anything we want. In this case, we are naming it logoutApiCall because we already have a function called logout that comes from authSlice and that only deals with the state of the app.

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');

    } catch (error) {
      toast.error(error?.data.message || error?.error);
    }
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={logo} alt="" />
              Proshop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link><FaShoppingCart />Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((accumulator, current) => accumulator + current.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link><FaUser />Sign In</Nav.Link>
                </LinkContainer>
              )}
              {!userInfo && (
                <LinkContainer to={'/register'}>
                  <Nav.Link>
                    <FaAddressCard /> Register
                  </Nav.Link>
                </LinkContainer>
              )}

              {(userInfo && userInfo.isAdmin) && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/users'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
