import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isLoggedIn , user } = useAuth();

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/job/post`,
        fixedSalary.length >= 4
          ? {
              title,
              description,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              title,
              description,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
            },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isLoggedIn || (user && user.Role !== "Employer")) {
      navigateTo("/");
    }
  }, [isLoggedIn, navigateTo, user]);

  return (
    <div className="min-h-screen bg-[#fbe9d1] dark:bg-[#374151] text-[#e74833] dark:text-[#66fcf1] p-4">
      <div className="container mx-auto max-w-lg p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold mb-6">POST NEW JOB</h3>
        <form onSubmit={handleJobPost}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            >
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              <option value="Frontend Web Development">
                Frontend Web Development
              </option>
              <option value="MERN Stack Development">
                MERN Stack Development
              </option>
              <option value="Account & Finance">Account & Finance</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Video Animation">Video Animation</option>
              <option value="MEAN Stack Development">
                MEAN Stack Development
              </option>
              <option value="MEVN Stack Development">
                MEVN Stack Development
              </option>
              <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
          </div>
          <div className="mb-4">
            {salaryType === "default" ? (
              <p>Please provide Salary Type *</p>
            ) : salaryType === "Fixed Salary" ? (
              <input
                type="number"
                placeholder="Enter Fixed Salary"
                value={fixedSalary}
                onChange={(e) => setFixedSalary(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
                required
              />
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="number"
                  placeholder="Salary From"
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
                  required
                />
                <input
                  type="number"
                  placeholder="Salary To"
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
                  required
                />
              </div>
            )}
          </div>
          <div className="mb-6">
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              className="w-full p-2 border border-gray-300 rounded bg-transparent dark:bg-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
