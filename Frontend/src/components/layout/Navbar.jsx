import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
function Navbar() {
  const { isLoggedIn , logout, user } = useAuth();
  const navigate = useNavigate();
  const logouthandler = async () => {
    console.log("Handle Logout");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      logout();
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to={"/"} className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="./images/full_logo.png" className="h-8" alt="JobSecure Logo" />
          </Link>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {isLoggedIn ? (
              <Link
                className="text-sm text-gray-500 dark:text-white hover:underline"
              >
                {user.firstname}  {user.lastname}
              </Link>
            ) : (
              <div> HI there</div>
            )}
            {!isLoggedIn ? (
              <Link to={"/login"}>
                <button className="text-blue-800 hover:underline">Login / Register</button>
              </Link>
            ) : (
              <div className="flex space-x-4 justify-evenly">
                <button className="">
                  <img
                    src={user.Avator}
                    alt="user Avatar"
                    className="w-10 hover:scale-110 border-4 border-x-black rounded-full dark:border-slate-200 items-center"
                  />
                </button>
                <button
                  onClick={logouthandler}
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex justify-center items-center space-x-4"
                >
                  <p>Logout</p>
                  <LuLogOut />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isLoggedIn && (
        <div>
          <nav className="bg-gray-50 dark:bg-gray-700">
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
              <div className="flex items-center">
                <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                  <li>
                    <Link to={"/"} className="text-gray-900 dark:text-white hover:underline" aria-current="page">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to={"/job/getall"} className="text-gray-900 dark:text-white hover:underline">
                      All Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to={"application/me"} className="text-gray-900 dark:text-white hover:underline">
                      {user.Role === "Employer" ? "Applicants' Applications" : "My Applications"}
                    </Link>
                  </li>
                  {user.Role === "Employer" ? (
                    <>
                    <li>
                      <Link to={"/job/post"} className="text-gray-900 dark:text-white hover:underline">
                        Post New Job
                      </Link>
                    </li>
                    <li>
                    <Link to={"/job/me"} className="text-gray-900 dark:text-white hover:underline">
                      View Your Jobs
                    </Link>
                  </li>
                  </>
                  ) : (<></>)}
                  
                </ul>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Navbar;
