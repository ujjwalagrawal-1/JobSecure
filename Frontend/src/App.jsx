import React, { useContext, useEffect } from 'react';
import { Context } from './main';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import JobFiles from './components/Job/JobFiles';
import JobDetails from './components/Job/JobDetails';
import Myjobs from './components/Job/Myjobs';
import PostJob from './components/Job/PostJob';
import Application from './components/Application/Application';
import MyApplication from './components/Application/MyApplication';
import Notfound from './components/Notfound/Notfound';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BACKEND_URL } from '../services/service';

function App() {
  const { isAuthorized, setAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/user/getuser`,
          {
            withCredentials: true,
          }
        );
        // console.log(response.data.User);
        setUser(response.data.User);
        setAuthorized(true);
      } catch (error) {
        
        setAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <BrowserRouter>
      <Toaster />
      <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/job/getall" element={<JobFiles />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job/post" element={<PostJob />} />
        <Route path="/job/me" element={<Myjobs />} />
        <Route path="/application/:id" element={<Application />} />
        <Route path="/application/me" element={<MyApplication />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
