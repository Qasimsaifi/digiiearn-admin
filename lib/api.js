export async function withdrawFunds(amount, userId) {
    try {
      // Create a data object with the amount and userId
      const data = {
        amount: amount,
        userId: userId,
      };
  
      const response = await fetch("https://digiiearn-api.vercel.app/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Failed to withdraw funds");
      }
  
      const responseData = await response.json();
      return responseData; // If the API returns any data upon success
  
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      // You can return an error message or handle the error as needed.
      return { error: "Failed to withdraw funds" };
    }
  }
  