document.getElementById("searchBtn").addEventListener("click", async () => {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = ""; // clear previous results

  if (!input) {
    resultsContainer.innerHTML = "<p>Please enter a keyword.</p>";
    return;
  }

  try {
    // Fetch the JSON data
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

    // Normalize input to handle plural variations
    let keyword = "";
    if (input.includes("beach")) keyword = "beaches";
    else if (input.includes("temple")) keyword = "temples";
    else if (input.includes("country")) keyword = "countries";

    if (!keyword) {
      resultsContainer.innerHTML = "<p>No matching results found. Try 'beach', 'temple', or 'country'.</p>";
      return;
    }

    const recommendations = data[keyword];


    // --- handle nested structure for countries ---
    if (keyword === "countries") {
      recommendations.forEach(country => {
        country.cities.forEach(city => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <img src="${city.imageUrl}" alt="${city.name}">
            <h3>${city.name}</h3>
            <p>${city.description}</p>
          `;
          resultsContainer.appendChild(card);
        });
      });
    } 
    // --- handle flat structure for temples/beaches ---
    else {
      recommendations.forEach(place => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${place.imageUrl}" alt="${place.name}">
          <h3>${place.name}</h3>
          <p>${place.description}</p>
        `;
        resultsContainer.appendChild(card);
      });
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    resultsContainer.innerHTML = "<p>Failed to load recommendations.</p>";
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("resultsContainer").innerHTML = "";
});