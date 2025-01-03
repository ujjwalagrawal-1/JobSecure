import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
function JobFiles() {
  const [jobs, setJobs] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get(`${BACKEND_URL}/api/v1/job/getall`, {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data.jobs);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }, [jobs]);
  if (!isLoggedIn) {
    navigateTo("/");
  }

  return (
    <div className="w-full min-h-[100vh] flex-col justify-center">
      <h1 className="font-extrabold text-center text-[50px]">All Jobs</h1>
      <div className=" mt-14 flex flex-wrap gap-8 items-center justify-center">
        {jobs.map((job) => (
          
          <Makejobcard
            key={job._id}
            jobid={job._id}
            jobtitle={job.title}
            description={job.description}
            category={job.category}
          />
        ))}
      </div>
    </div>
  );
}

function Makejobcard({
  jobid,
  jobtitle,
  description,
  category
}) {
  return (
    <div className="max-w-sm w-80 h-96 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
  <h5 className="cursor-pointer mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    {jobtitle}
  </h5>
  <div className="flex flex-col justify-evenly h-full">
    <div className="dark:text-white mt-4">Job Description :</div>
    <div className="mt-2 mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis w-full h-40">
      {description}
    </div>
    <div className="flex justify-start space-x-4">
      <h1 className="dark:text-white">Category :</h1>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {category}
      </p>
    </div>
    <Link
      to={`/job/${jobid}`}
      className="inline-flex items-center px-3 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-auto"
    >
      Get more Details
      <svg
        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </Link>
  </div>
</div>

  );
}

export default JobFiles;
