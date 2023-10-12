"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const CoursePurchaseRequest = () => {
  const [courseRequests, setCourseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseRequests() {
      try {
        const response = await fetch(
          "https://digiiearn-api.onrender.com/api/course/request"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCourseRequests(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchCourseRequests();
  }, []);


  const handleReject = async (requestId) => {
    try {
      // Make an API call to delete the rejected request
      const response = await fetch(
        `https://digiiearn-api.onrender.com/api/course/request/${requestId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to delete the request. Response status:",
          response.status
        );
        const errorData = await response.json();
        console.error("Error data from the API:", errorData);
        throw new Error("Failed to delete the request");
      }

      // After successfully rejecting, remove the request from the list
      const updatedRequests = courseRequests.filter(
        (request) => request.coursePurchaseRequest._id !== requestId
      );
      setCourseRequests(updatedRequests);

      console.log(`Rejected request with ID ${requestId}`);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };


  const handleApprove = async (requestId) => {
    try {
      const approvedRequest = courseRequests.find(
        (request) => request.coursePurchaseRequest._id === requestId
      );

      const dataToSend = {
        courseName: approvedRequest.coursePurchaseRequest.courseName,
        courseCommision: approvedRequest.coursePurchaseRequest.courseCommission,
        coursePrice: approvedRequest.coursePurchaseRequest.coursePrice,
        referrer: approvedRequest.coursePurchaseRequest.referrer,
        userId: approvedRequest.user._id,
        slug: approvedRequest.coursePurchaseRequest.slug,
      };

      const response = await fetch(
        "https://digiiearn-api.onrender.com/api/course/mapping",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to send data to the API. Response status:",
          response.status
        );
        const errorData = await response.json();
        console.error("Error data from the API:", errorData);
        throw new Error("Failed to send data to the API");
      }

      console.log(`Approved request with ID ${requestId}`);
      handleReject(requestId)
    } catch (error) {
      console.error(
        "Error approving request and sending data to the API:",
        error
      );
    }
  };



  return (
    <div className="mx-auto max-w-screen-md">
      <h1 className="text-center font-bold text-3xl">
        Course Purchase Requests
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-xs table-pin-rows table-pin-cols w-[70vw]">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Course Price</th>
              <th>Is Refered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseRequests.map((request) => (
              <tr key={request.coursePurchaseRequest._id}>
                <td>{request.coursePurchaseRequest.courseName}</td>
                <td>
                  {request.user.firstName} {request.user.lastName}
                </td>
                <td>{request.user.email}</td>
                <td>{request.coursePurchaseRequest.coursePrice}</td>
                <td>
                  {request.coursePurchaseRequest.referrer ? (
                    <Icon icon="icon-park-solid:correct" width="22" />
                  ) : null}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        handleApprove(request.coursePurchaseRequest._id)
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleReject(request.coursePurchaseRequest._id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursePurchaseRequest;
