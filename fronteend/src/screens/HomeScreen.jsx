import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';

import { useGetProductsQuery } from '../slices/productsApiSlice'
import Message from '../components/Message'
import ProductCarousel from '../components/ProductCarousel'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import { Link } from 'react-router-dom'
import Meta from '../components/Meta';

function HomeScreen() {

  const { keyword, currentPage } = useParams()

  const { data, isLoading, error } = useGetProductsQuery({ keyword, currentPage })
  // If loading show the loading component, if no, is there any error, if so show the eror if not show the actual Component 

  return (
    <>
    
      {
        !keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light mb-4'>Go Back</Link>
      }

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
        <Meta title='Welcome' />
          <h1>Latest products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            totalPages={data.totalPages}
            currentPage={data.currentPage}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )

}

export default HomeScreen;
