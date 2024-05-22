import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetProductsQuery } from "../../slices/productsApiSlice";

function ProductList() {

  const { data: products, isLoading: isProductsLoading, error } = useGetProductsQuery();

  const deleteProductHandler = (productId) => {
      console.log(productId)
  }
  return <>
    <Row className="align-items-center">
      <Col>
        <h1>Products</h1>
      </Col>
      <Col className="text-end">
        <Button className="btn-sm m-3">
          <FaEdit /> Create Product
        </Button>
      </Col>
    </Row>

    {isProductsLoading ? <Loader /> : error ? <Message variant='danger'>{error?.message || error?.error}</Message> :
      (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                        <FaEdit/>
                        </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteProductHandler(product._id)}>
                      <FaTimes style={{color: 'white'}} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )

    }
  </>
}

export default ProductList;