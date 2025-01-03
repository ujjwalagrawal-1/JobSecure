import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        toast.error("Job is closed now. Please apply for a new job.");
        navigateTo("/notfound");
      });
  }, [id, navigateTo]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigateTo("/login");
    }
  }, [isLoggedIn, navigateTo]);

  return (
    <div className="min-h-screen bg-[#fbe9d1] dark:bg-[#374151] text-[#e74833] dark:text-[#66fcf1] p-4">
      <Card
        key={job.id}
        apply={job._id}
        title={job.title}
        description={job.description}
        category={job.category}
        country={job.country}
        city={job.city}
        location={job.location}
        fixedSalary={job.fixedSalary}
        salaryFrom={job.salaryFrom}
        salaryTo={job.salaryTo}
      />
    </div>
  );
}

function Card({
  title,
  apply,
  description,
  category,
  country,
  city,
  location,
  fixedSalary,
  salaryTo,
  salaryFrom,
}) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-8">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <DetailItem label="Category" value={category} />
        <DetailItem label="Description" value={description} />
        <DetailItem label="Country" value={country} />
        <DetailItem label="City" value={city} />
        <DetailItem label="Location" value={location} />
        <DetailItem label="Salary" value={fixedSalary ? fixedSalary : `${salaryFrom} - ${salaryTo}`} />
        {}
      </div>
      <Link to={`/application/${apply}`}><button type="button" className="mt-5 p-5 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Apply</button></Link>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
      <dt className="text-sm font-medium">{label}</dt>
      <dd className="mt-1 text-lg">{value}</dd>
    </div>
  );
}

export default JobDetails;
