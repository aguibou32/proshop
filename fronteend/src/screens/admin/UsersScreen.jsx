import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from 'react-bootstrap'
import { FaEye, FaTimes } from 'react-icons/fa'
import Message from "../../components/Message";
import Loader from "../../components/Loader";

import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";


function UsersScreen() {

  const { data: users, isLoading: isUsersLoading, error } = useGetUsersQuery()
  const [deleteUser, { isLoading: deleteUserLoading, refetch }] = useDeleteUserMutation()

  const handleUserDelete = async (user) => {
    if(window.confirm('Are you sure ?')){
      try {
        await deleteUser(user)
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const handleTogleAdminRole = () => {
    console.log('toggle admin role')
  }


  return isUsersLoading ? <Loader /> : (
    <>
      <h2>Users</h2>

      {deleteUserLoading && <Loader />}
      {
        error ? <Message variant='danger'>{error?.data?.message || error?.error}</Message> :
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>CREATED AT</th>
                <th>VIEW</th>
                <th>ROLE</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt.substring(0, 10)}</td>
                  <td>
                    <LinkContainer to={`/admin/users/${user._id}`}>
                      <Button variant="light"><FaEye /></Button>
                    </LinkContainer>
                  </td>
                  <td>{!user.isAdmin && <Button className="btn btn-sm text-white" variant="dark" onClick={handleTogleAdminRole}>Make Admin</Button>}</td>
                  <td>{!user.isAdmin && <Button className="btn btn-sm" variant="light" onClick={()=>handleUserDelete(user)}><FaTimes style={{ color: 'red' }} /></Button>} </td>
                </tr>
              ))}
            </tbody>
          </Table>
      }
    </>
  )
}

export default UsersScreen;
