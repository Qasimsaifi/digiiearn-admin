"use client"
import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('https://digiiearn-api.kasimsaifi.tech//api/earnings/leader', {
          cache: "no-cache"
        });

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
          setIsLoading(false); // Data has been loaded, set loading to false
        } else {
          console.error('Failed to fetch leaderboard data');
          setIsLoading(false); // Loading failed, set loading to false
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setIsLoading(false); // Loading failed, set loading to false
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      {isLoading ? ( // Render a loading indicator if isLoading is true
        <div>Loading...</div>
      ) : (
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
      )}
    </div>
  );
};

export default Leaderboard;
