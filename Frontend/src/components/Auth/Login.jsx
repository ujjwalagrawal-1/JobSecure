import React, {useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Input from "../comp/Input";
import axios from "axios"; // Import axios
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
function Login() {
  const { storeTokenInLS , isLoggedIn , user } = useAuth();
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("");
  const navigateTo = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        {
          Username,
          Email,
          Password,
          Role,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      storeTokenInLS(response.data.token);
    } catch (error) {
      toast.error(error.response.data.message || "Some thing Went Wrong Please Re-Enter details")
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      toast.success("Login Success")
      navigateTo('/');
    }
  }, [isLoggedIn, user]);
  

  return (
    <div className="w-full h-auto flex justify-evenly items-center bg-[#1A2130]">
      <div className="my-10 w-full max-w-md p-8 border border-red-500 rounded-lg bg-[#83B4FF]">
        <p className="text-3xl text-black mb-6 text-center">Login</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <Input
            label={"Username*"}
            Inputtype={"text"}
            Placeholder={"Enter your username"}
            onchange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            label={"Email*"}
            Inputtype={"email"}
            Placeholder={"Enter your email"}
            onchange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label={"Password*"}
            Inputtype={"password"}
            Placeholder={"Enter your password"}
            onchange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Role* 
            <select
              className="block w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-2"
              value={Role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                In which category have you registered?
              </option>
              <option value="Employer">Employer</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
          </label>
          <button type="submit" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Login</button>
            
        </form>
        <div className="flex space-x-2 p-2"> <p className="">Don't have an Account ? </p><Link to={"/register"}><span className="underline">Register</span></Link></div>
        
      </div>
      <div className="w-[80vh]">
        <img
          src="./images/Registergi.gif"
          className="border-red-400 rounded-lg sm:hidden md:block"
          alt=""
        />
      </div>
    </div>
  );
}

export default Login;
