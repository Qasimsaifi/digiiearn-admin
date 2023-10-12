"use client"
import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('http://localhost:5001/api/earnings/leader'); // Create an API route for this
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        } else {
          console.error('Failed to fetch leaderboard data');
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
  <div>
    {leaderboardData.map((user, index) => (
      <div
        key={user._id}
        className="bg-gradient-to-r from-blue-500 to-red-500 text-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <span className="font-bold text-lg mr-2">{index + 1}.</span>
          <img
            src={user.profilePicture}
            alt={user.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="ml-2">{`${user.firstName} ${user.lastName}`}</span>
        </div>
        <div className="text-xl font-semibold">₹ {user.totalEarnings}</div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Leaderboard;
