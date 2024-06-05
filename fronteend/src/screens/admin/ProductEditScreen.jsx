import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, FormLabel } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation
} from '../../slices/productsApiSlice';



function ProductEditScreen() {

  const { id: productId } = useParams();
  const { data: product, isLoading: isProductLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: isUpdateProductLoading }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: isUploadLoading }] = useUploadProductImageMutation();
  // console.log(product);


  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    numReviews: 0,
    description: ''
  });

  const { name, price, image, brand, category, countInStock, numReviews, description } = formData;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        numReviews: product.numReviews,
        description: product.description
      })
    }
  }, [product])


  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }))
  };

  const handleUploadFile = async (e) => {

    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message); // res.message comes from the multer middleware

      setFormData(prevData => ({
        ...prevData,
        image: res.image
      }))
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description
    }

    try {

      await updateProduct(updatedProduct);
      toast.success('Product edited');
      refetch();
      navigate('/admin/productList');

    } catch (error) {
      toast.error(error?.data.message || error?.error);
    }
  };

  return <>
    <Link to='/admin/productlist' className='btn btn-light my-3'>
      Go Back
    </Link>

    <FormContainer>
      <h1>Edit Product</h1>
      {isUpdateProductLoading && <Loader />}
      {isUploadLoading && <Loader />}

      {
        isProductLoading ? <Loader /> : error ? <Message variant='danger'>{error?.error}</Message> : (
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId='name' className='my-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='price' className='my-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='brand' className='my-3'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Form.Control type='text' placeholder='Enter image url' value={image} onChange={handleChange} ></Form.Control>
              <Form.Control type='file' label='Chose file'
                onChange={handleUploadFile}
              ></Form.Control>
            </Form.Group>

              {isUpdateProductLoading && <Loader />}

            <Form.Group controlId='category' className='my-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock' className='my-3'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter stock count'
                value={countInStock}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='numReviews' className='my-3'>
              <Form.Label>Reviews</Form.Label>
              <Form.Control
                readOnly
                type='number'
                placeholder='Enter stock count'
                value={countInStock}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='description' className='my-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={handleChange}
              >
              </Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              className='my-2'
            >
              Update
            </Button>
          </Form>
        )
      }
    </FormContainer>
  </>
}

export default ProductEditScreen;