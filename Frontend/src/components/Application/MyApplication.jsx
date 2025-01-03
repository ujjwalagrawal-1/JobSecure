import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { BACKEND_URL } from "../../../services/service";
import { useAuth } from "../../Authcontext";
const MyApplications = () => {
  const { user, isLoggedIn } = useAuth();
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const navigateTo = useNavigate();
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint =
          user && user.Role === "Employer"
            ? `${BACKEND_URL}/api/v1/application/employer/getall`
            : `${BACKEND_URL}/api/v1/application/jobseeker/getall`;
        const res = await axios.get(endpoint, {
          withCredentials: true,
        });
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    if (isLoggedIn) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [isLoggedIn, navigateTo, user]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/v1/application/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page bg-[#374151] text-[#66fcf1] min-h-screen p-8">
      <div className="container max-w-5xl mx-auto">
        {user && user.Role === "Job Seeker" ? (
          <>
            <h1 className="text-3xl mb-6 text-center">My Applications</h1>
            {applications.length === 0 ? (
              <h4 className="text-center">No Applications Found</h4>
            ) : (
              applications.map((element) => (
                <JobSeekerCard
                  key={element._id}
                  element={element}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                />
              ))
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl mb-6 text-center">
              Applications From Job Seekers
            </h1>
            {applications.length === 0 ? (
              <h4 className="text-center">No Applications Found</h4>
            ) : (
              applications.map((element) => (
                <EmployerCard
                  key={element._id}
                  element={element}
                  openModal={openModal}
                />
              ))
            )}
          </>
        )}
      </div>
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="job_seeker_card bg-gray-800 p-4 mb-4 rounded-lg shadow-md">
      <div className="detail mb-4">
        <p>
          <span className="font-semibold">Name:</span> {element.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {element.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {element.phone}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {element.address}
        </p>
        <p>
          <span className="font-semibold">Cover Letter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume mb-4">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
          className="cursor-pointer rounded-lg"
        />
      </div>
      <div className="btn_area">
        <button
          onClick={() => deleteApplication(element._id)}
          className="btn btn-danger"
        >
          Delete Application
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <div className="job_seeker_card bg-gray-800 p-4 mb-4 rounded-lg shadow-md">
      <div className="detail mb-4">
        <p>
          <span className="font-semibold">Name:</span> {element.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {element.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {element.phone}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {element.address}
        </p>
        <p>
          <span className="font-semibold">Cover Letter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume mb-4">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
          className="cursor-pointer rounded-lg"
        />
      </div>
    </div>
  );
};
