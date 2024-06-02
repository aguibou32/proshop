import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Form, Button, FormGroup } from 'react-bootstrap'
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import FormContainer from "../../components/FormContainer"
import { toast } from 'react-toastify'
import { useGetUserQuery, useUpdateUserMutation } from "../../slices/usersApiSlice"

function UserEditScreen() {

  const { id: userId } = useParams()
  const navigate = useNavigate()

  const { data: user, isLoading: isUserLoading, error: errorLoadingUser, refetch } = useGetUserQuery(userId)

  const [updateUser, { isLoading: isUpdateUserLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    password: '',
    confirmPassword: ''
  })

  const { name, email, isAdmin, password, confirmPassword } = formData

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
        password: '',
        confirmPassword: ''
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('passwords do not match')
    } else {
      try {

        const updatedUser = {
          _id: user._id,
          name,
          email,
          isAdmin,
          password
        }

        await updateUser(updatedUser).unwrap()
        refetch()
        navigate('/admin/users')

        toast.success('User updated')
      } catch (err) {
        console.log(err)
        toast.error(err?.data.message || err?.error)
      }
    }
  }

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target

    setFormData(prevData => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  return isUserLoading ? <Loader /> : errorLoadingUser ? <Message variant='danger'>{errorLoadingUser?.data?.message || errorLoadingUser.message}</Message> :
    (
      <>
        <h4>Edit User: {user._id}</h4>

        <Row>
          <FormContainer>
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

              <Form.Group controlId='isAdmin' className='my-2'>
                <Form.Check
                  type='checkbox'
                  label='Is Admin'
                  checked={isAdmin}
                  onChange={handleChange}
                />
              </Form.Group>

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

              <Button className='mt-2' type='submit' variant='primary' disabled={isUpdateUserLoading}>{isUpdateUserLoading ? 'Processing...' : 'Submit'}</Button>

              {isUpdateUserLoading && <Loader />}
            </Form>
          </FormContainer>
        </Row>
      </>
    )
}

export default UserEditScreen;