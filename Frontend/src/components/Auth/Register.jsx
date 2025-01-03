import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import Input from "../comp/Input";
import axios from "axios"; // Import axios
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
function Register() {
  const {storeTokenInLS , isLoggedIn} = useAuth();
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
    const [Avator, setAvator] = useState(
      `https://avatar.iran.liara.run/username?username=${firstname}+${lastname}`
    );
  const [Phone, setPhone] = useState("");
  const [Role, setRole] = useState("");
  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        {
          Username,
          Email,
          Password,
          ConfirmPassword,
          Avator,
          firstname,
          lastname,
          Phone,
          Role,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      console.log(response.data);
      storeTokenInLS(response.data.token);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Some thing Went wrong");
    }
  };
  return (
    <div className="w-full h-auto flex justify-evenly items-center bg-[#1A2130]">
      <div className="my-10 w-full max-w-md p-8 border border-red-500 rounded-lg bg-[#83B4FF]">
        <p className="text-3xl text-black mb-6 text-center">Register</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleRegister}>
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
          <Input
            label={"Confirm Password*"}
            Inputtype={"password"}
            Placeholder={"Confirm your password"}
            onchange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <Input
            label={"Phone*"}
            Inputtype={"tel"}
            Placeholder={"Enter your phone number"}
            onchange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <Input
            label={"First Name*"}
            Inputtype={"text"}
            Placeholder={"Enter your first name"}
            onchange={(e) => {
              setFirstname(e.target.value);
            }}
          />
          <Input
            label={"Last Name*"}
            Inputtype={"text"}
            Placeholder={"Enter your last name"}
            onchange={(e) => {
              setLastname(e.target.value);
            }}
          />
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Role*
            <select
              className="block w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-2"
              value={Role} // Ensure the select value is set
              onChange={(e) => {
                setRole(e.target.value);
                setAvator(`https://avatar.iran.liara.run/username?username=${firstname}+${lastname}`);
              }}
            >
              <option value="" disabled>
                In which category are you registering?
              </option>
              <option value="Employer">Employer</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
          </label>
          <button type="submit" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Register
          </button>
        </form>
        <div className="flex space-x-2 p-2">
          <p className="">Already have an Account?</p>
          <Link to={"/login"}>
            <span className="underline">Login</span>
          </Link>
        </div>
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

export default Register;
