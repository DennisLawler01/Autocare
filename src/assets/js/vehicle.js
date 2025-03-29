document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("year");
  const makeSelect = document.getElementById("make");
  const modelSelect = document.getElementById("model");
  const trimInput = document.getElementById("trim");
  const mileageInput = document.getElementById("mileage");
  const addVehicleBtn = document.getElementById("add-vehicle-button");
  const vehicleContainer = document.getElementById("vehicle-container");

  let vehicleData = {};
  let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

  // Load JSON
  fetch("../../YearsMakesModels.json")
    .then(response => response.json())
    .then(data => {
      vehicleData = data;
      populateYears();
    })
    .catch(error => console.error("Failed to load vehicle data:", error));

  function populateYears() {
    const years = Object.keys(vehicleData).sort();
    years.forEach(year => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }

  addVehicleBtn.addEventListener("click", () => {
    const year = yearSelect.value;
    const make = makeSelect.value;
    const model = modelSelect.value;
    const trim = trimInput.value.trim();
    const mileage = mileageInput.value.trim();

    if (!year || !make || !model || !trim || !mileage) {
      alert("Please fill out all vehicle details.");
      return;
    }

    const timestamp = new Date().toLocaleString();
    const newVehicle = { year, make, model, trim, mileage, timestamp };

    vehicles.push(newVehicle);
    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    location.reload();

    yearSelect.value = "";
    makeSelect.innerHTML = "";
    modelSelect.innerHTML = '<option value="">Select a Make First</option>';
    trimInput.value = "";
    mileageInput.value = "";
    makeSelect.disabled = true;
    modelSelect.disabled = true;
  });

  makeSelect.disabled = true;
  modelSelect.disabled = true;

  yearSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;
    makeSelect.innerHTML = '<option value="">Select Make</option>';
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    makeSelect.disabled = true;
    modelSelect.disabled = true;

    if (selectedYear && vehicleData[selectedYear]) {
      const makes = Object.keys(vehicleData[selectedYear]);
      makes.forEach(make => {
        const option = document.createElement("option");
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
      });
      makeSelect.disabled = false;
    }
  });

  makeSelect.addEventListener("change", () => {
    const selectedYear = yearSelect.value;
    const selectedMake = makeSelect.value;
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    modelSelect.disabled = true;

    if (selectedYear && selectedMake) {
      const models = vehicleData[selectedYear][selectedMake];
      models.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
      modelSelect.disabled = false;
    }
  });

  function renderVehicles() {
    vehicleContainer.innerHTML = "";
    vehicles.forEach((vehicle, index) => {
      const card = document.createElement("div");
      card.className = "vehicle-card";

      card.innerHTML = `
        <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
        <p><strong>Trim:</strong> ${vehicle.trim}</p>
        <label for="mileage-${index}"><strong>Mileage:</strong></label>
        <input type="number" id="mileage-${index}" value="${vehicle.mileage}" disabled />
        <button class="maint-btn">🔧 Maintenance</button>
        <button class="fuel-btn">⛽ Fuel Log</button>
        <button class="edit-btn">✏️ Edit</button>
        <button class="remove-btn" style="background-color: #f44336; color: white;">🗑️ Remove</button>
      `;

      const mileageInput = card.querySelector(`#mileage-${index}`);
      const editBtn = card.querySelector(".edit-btn");

      editBtn.addEventListener("click", () => {
        if (editBtn.textContent.includes("Edit")) {
          mileageInput.disabled = false;
          mileageInput.focus();
          editBtn.textContent = "💾 Save";
        } else {
          const newMileage = parseInt(mileageInput.value);
          if (isNaN(newMileage) || newMileage < 0) {
            alert("Please enter a valid mileage.");
            return;
          }
          vehicles[index].mileage = newMileage;
          localStorage.setItem("vehicles", JSON.stringify(vehicles));
          mileageInput.disabled = true;
          editBtn.textContent = "✏️ Edit";
        }
      });

      card.querySelector(".maint-btn").addEventListener("click", () => goToMaintenance(vehicles[index]));
      card.querySelector(".fuel-btn").addEventListener("click", () => goToFuel(vehicles[index]));
      card.querySelector(".remove-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to remove this vehicle?")) {
          vehicles.splice(index, 1);
          localStorage.setItem("vehicles", JSON.stringify(vehicles));
          renderVehicles();
        }
      });

      vehicleContainer.appendChild(card);
    });
  }

  function goToMaintenance(vehicle) {
    const query = new URLSearchParams(vehicle).toString();
    window.location.href = `../maintenance/maintenance-db.html?${query}`;
  }

  function goToFuel(vehicle) {
    const query = new URLSearchParams(vehicle).toString();
    window.location.href = `../fuel/fuel.html?${query}`;
  }

  if (vehicleContainer) renderVehicles();
});