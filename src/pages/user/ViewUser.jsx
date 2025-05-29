import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUsersQuery } from '../../redux/feature/users/userApiSlice';
import LoadingFetchingDataComponent from '../../components/LoadingFetchingDataComponent';
import ViewDetailUser from './ViewDetailUser';

function ViewUser() {
  const { id }= useParams() 

   const { user } = useGetUsersQuery("usersList", {
     selectFromResult: ({ data }) => ({
       user: data?.entities[id],
     }),
   });   

   let content;
 
  
   if (!user) {
    content = <LoadingFetchingDataComponent />;
  }

  content = <ViewDetailUser user={user} />;

  return content;
}

export default ViewUser
