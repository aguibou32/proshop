import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center ppy-3'></Col>
          <p>Proshop &copy; {currentYear}</p>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer