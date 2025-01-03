import React from 'react'
import { Navigate } from 'react-router-dom';
import Herosection from './Herosection';
import Howitworks from './Howitworks';
import Popularcategory from './Popularcategory';
import PopularCompanies from './PopularCompanies';
import { useAuth } from '../../Authcontext';

function Home() {
  const {isLoggedIn} = useAuth();
  if(!isLoggedIn){
    return <Navigate to={"/login"} />
  }
  return (
    <div>
      <Herosection/>
      {/* <Howitworks/> */}
      {/* <Popularcategory/>
      <PopularCompanies/>  */}
    </div>

  )
}

export default Home