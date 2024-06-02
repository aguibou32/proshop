import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import { toast } from 'react-toastify';


function ProductList() {

  const { currentPage } = useParams();

  const { data, isLoading: isProductsLoading, error, refetch } = useGetProductsQuery({ currentPage });
  const [createProduct, { isLoading: isCreateProductLoading }] = useCreateProductMutation();

  const [deleteProduct, { isLoading: isProductDeleteLoading }] = useDeleteProductMutation();

  const deleteProductHandler = async (product) => {

    if (window.confirm('Are you sure ?')) {
      try {
        await deleteProduct(product);
        refetch();
        toast.success('Product Deleted !')
      } catch (err) {
        toast.error(err?.data?.message || err?.error);
      }
    }
  }

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to add a new product ?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }


  return <>
    <Row className="align-items-center">
      <Col>
        <h1>Products</h1>
      </Col>
      <Col className="text-end">
        <Button className="btn-sm m-3" onClick={createProductHandler}>
          <FaEdit /> Create Product
        </Button>
      </Col>
    </Row>

    {isCreateProductLoading && <Loader />}
    {isProductDeleteLoading && <Loader />}

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
              {data.products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteProductHandler(product)}>
                      <FaTimes style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            totalPages={data.totalPages}
            currentPage={data.currentPage}
            isAdmin={true}
          />
        </>
      )

    }
  </>
}

export default ProductList;