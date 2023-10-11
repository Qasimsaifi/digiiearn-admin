"use client";
import React, { useState, useEffect } from "react";
import { withdrawFunds } from "@/lib/api";
const WalletWithdrawalRequest = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAproving , setIsAproving] = useState(false)
  useEffect(() => {
    async function fetchWithdrawalRequests() {
      try {
        const response = await fetch(
          "https://digiiearn-api.vercel.app/api/wallet/request/all"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // console.log(data);
        setWithdrawalRequests(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchWithdrawalRequests();
    // console.log(withdrawalRequests);
  }, []);

  const handleApprove = async (requestId , amount , email , userId) => {
    try {
      setIsAproving(true)
      const response = await fetch(
        `https://digiiearn-api.vercel.app/api/wallet/request/${requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'settled' , email : email , amount : amount }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      const updatedRequests = withdrawalRequests.filter(
        (request) => request.id !== requestId
      );
      const withdrawResponse = await withdrawFunds(amount, userId);

      if (withdrawResponse.error) {
        // Handle withdrawal error
        console.error('Failed to withdraw funds:', withdrawResponse.error);
      }
      setIsAproving(false)
      setWithdrawalRequests(updatedRequests);

      console.log(`Approved withdrawal request with ID `);
      window.location.reload();
    } catch (error) {
      console.error('Error approving withdrawal request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setIsLoading(true);
  
      const response = await fetch(
        `https://digiiearn-api.vercel.app/api/wallet/request/${requestId}`,
        {
          method: 'DELETE',
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to update request status');
      }
  
      const updatedRequests = withdrawalRequests.filter(
        (request) => request.id !== requestId
      );
  
      setWithdrawalRequests(updatedRequests);
    } catch (error) {
      console.error('Error rejecting withdrawal request:', error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };
  
  return (
    <div className="mx-auto max-w-screen-md">
      <h1 className="text-center font-bold text-3xl">
        Wallet Withdrawal Requests
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-xs table-pin-rows table-pin-cols w-[70vw]">
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>User Mobile</th>
              <th>UPI ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalRequests.map((request , index) => (
              <tr key={index}>
                <td>{request.user.firstName} {request.user.lastName}</td>
                <td>{request.user.email}</td>
                <td>{request.user.mobileNumber}</td>
                <td>{request.request.upi}</td>
                <td>{request.request.amount}</td>
                <td>{request.request.status}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleApprove(request.request._id , request.request.amount ,request.user.email  , request.user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleReject(request.request._id)}
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

export default WalletWithdrawalRequest;
