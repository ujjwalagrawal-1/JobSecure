import React, { useContext } from 'react'
import { Context } from '../../main'
import { Navigate } from 'react-router-dom';
import Herosection from './Herosection';
import Howitworks from './Howitworks';
import Popularcategory from './Popularcategory';
import PopularCompanies from './PopularCompanies';

function Home() {
  const {isAuthorized} = useContext(Context);
  if(!isAuthorized){
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