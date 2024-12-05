import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTripDetails, setSelectedTripDetails] = useState(null); // For trip details
  const uri = "https://tripapi.cphbusinessapps.dk/api/trips";

  const categories = ["All", "BEACH", "CITY", "SNOW", "LAKE", "FOREST", "SEA"];

  useEffect(() => {
    const fetchAllTrips = async () => {
      const response = await fetch(uri);
      const tripList = await response.json();

      setTrips(tripList);
      setFilteredTrips(tripList);
    };

    fetchAllTrips();
  }, []);

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;

    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const handleCategoryChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);

    if (selected === "All") {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) => trip.category === selected);
      setFilteredTrips(filtered);
    }
  };

  const handleTripClick = async (tripId) => {
    const response = await fetch(`${uri}/${tripId}`);
    const details = await response.json();
    setSelectedTripDetails(details);
  };

  return (
    <div className="app-container">
      {/* Left Column */}
      <div className="left-panel">
        <h2>All Trips</h2>

        {/* Dropdown for category */}
        <div style={{ marginBottom: "20px" }}>
          <label>Filter by Category: </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {filteredTrips.length === 0 ? (
          <p>No trips available for the selected category.</p>
        ) : (
          <ul>
            {filteredTrips.map((trip) => (
              <li
                key={trip.id}
                className="trip-item"
                onClick={() => handleTripClick(trip.id)}
              >
                <h3>{trip.name}</h3>
                <p>Start Date: {new Date(trip.starttime).toLocaleDateString()}</p>
                <p>End Date: {new Date(trip.endtime).toLocaleDateString()}</p>
                <p>Price: {trip.price} DKK</p>
                <p>Duration: {calculateDuration(trip.starttime, trip.endtime)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="right-panel">
        <h2>Details View</h2>
        {selectedTripDetails ? (
          <div>
            <h3>{selectedTripDetails.name}</h3>
            <p>Start Date: {new Date(selectedTripDetails.starttime).toLocaleDateString()}</p>
            <p>End Date: {new Date(selectedTripDetails.endtime).toLocaleDateString()}</p>
            <p>Price: {selectedTripDetails.price} DKK</p>
            <p>Category: {selectedTripDetails.category}</p>
            {selectedTripDetails.guide ? (
              <>
                <p>Guide: {`${selectedTripDetails.guide.firstname} ${selectedTripDetails.guide.lastname}`}</p>
                <p>Email: {selectedTripDetails.guide.email}</p>
                <p>Phone: {selectedTripDetails.guide.phone}</p>
                <p>Years of Experience: {selectedTripDetails.guide.yearsOfExperience}</p>
              </>
            ) : (
              <p>Guide: Not available</p>
            )}
            <h3>Packing Items</h3>
            {selectedTripDetails.packingItems && selectedTripDetails.packingItems.length > 0 ? (
              <table className="packing-items-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Weight (grams)</th>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Shop URL</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTripDetails.packingItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.weightInGrams}</td>
                      <td>{item.quantity}</td>
                      <td>{item.description}</td>
                      <td>{item.category}</td>
                      <td>
                        {item.buyingOptions && item.buyingOptions.length > 0 ? (
                          item.buyingOptions.map((option, optIndex) => (
                            <div key={optIndex}>
                                {option.shopName} - {option.price} DKK
                            </div>
                          ))
                        ) : (
                          "No buying options"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No packing items available</p>
            )}
          </div>
        ) : (
          <p>Select a trip to see more details here.</p>
        )}
      </div>
    </div>
  );
}

export default App;
