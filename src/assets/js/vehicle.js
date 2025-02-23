document.addEventListener("DOMContentLoaded", () => {
    // Car makes and their models
    const carData = {
      "Acura": ["ILX", "MDX", "NSX", "RDX", "TLX"],
      "Alfa": ["Giulia", "Stelvio", "4C Spider"],
      "Audi": ["A3", "A4", "A5", "A6", "A7", "Q3", "Q5", "Q7", "R8"],
      "Bentley": ["Bentayga", "Continental GT", "Flying Spur"],
      "BMW": ["1 Series", "3 Series", "5 Series", "7 Series", "X3", "X5", "Z4"],
      "Buick": ["Enclave", "Encore", "Envision", "Regal", "LaCrosse"],
      "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6"],
      "Chevrolet": ["Bolt", "Camaro", "Corvette", "Equinox", "Silverado", "Tahoe"],
      "Chrysler": ["300", "Pacifica", "Voyager"],
      "Dodge": ["Charger", "Challenger", "Durango", "Journey"],
      "Fiat": ["500", "500X", "Spider 124"],
      "Ford": ["Bronco", "Edge", "Escape", "Explorer", "F-150", "Mustang"],
      "Genesis": ["G70", "G80", "G90"],
      "GMC": ["Acadia", "Canyon", "Sierra", "Terrain", "Yukon"],
      "Honda": ["Accord", "Civic", "CR-V", "Pilot", "Ridgeline"],
      "Hyundai": ["Elantra", "Kona", "Santa Fe", "Sonata", "Tucson"],
      "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
      "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "XE", "XF"],
      "Jeep": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Wrangler"],
      "Kia": ["Forte", "Optima", "Sorento", "Soul", "Sportage"],
      "Land Rover": ["Defender", "Discovery", "Range Rover", "Velar"],
      "Lexus": ["ES", "GX", "IS", "LX", "NX", "RX", "UX"],
      "Lincoln": ["Aviator", "Corsair", "Nautilus", "Navigator"],
      "Maserati": ["Ghibli", "Levante", "Quattroporte"],
      "Mazda": ["CX-3", "CX-5", "CX-9", "MX-5 Miata"],
      "Mercedes Benz": ["A-Class", "C-Class", "E-Class", "GLC", "GLE", "S-Class"],
      "Mini": ["Clubman", "Countryman", "Hardtop"],
      "Mitsubishi": ["Eclipse Cross", "Mirage", "Outlander"],
      "Nissan": ["Altima", "Frontier", "Maxima", "Rogue", "Titan"],
      "Porsche": ["911", "Cayenne", "Macan", "Panamera"],
      "RAM": ["1500", "2500", "3500", "ProMaster"],
      "Subaru": ["Ascent", "Forester", "Impreza", "Outback", "WRX"],
      "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
      "Toyota": ["4Runner", "Camry", "Corolla", "Highlander", "Tacoma", "Tundra"],
      "Volkswagen": ["Atlas", "Golf", "Jetta", "Passat", "Tiguan"],
      "Volvo": ["S60", "S90", "V60", "XC40", "XC60", "XC90"]
    };
  
    const makeSelect = document.getElementById("make");
    const modelSelect = document.getElementById("model");
    const addVehicleButton = document.getElementById("add-vehicle-button");
    const vehicleList = document.getElementById("vehicle-list");
  
    // Add default option dropdown
    const defaultMakeOption = document.createElement("option");
    defaultMakeOption.value = "";
    defaultMakeOption.textContent = "Select a make";
    makeSelect.appendChild(defaultMakeOption);
  
    // Populate the make dropdown with car makes
    Object.keys(carData).forEach(make => {
      let option = document.createElement("option");
      option.value = make;
      option.textContent = make;
      makeSelect.appendChild(option);
    });
  
    // Populate models when a make is selected
    makeSelect.addEventListener("change", function() {
      const selectedMake = makeSelect.value;
      modelSelect.innerHTML = ""; // Clear existing
  
      if (selectedMake) {
        carData[selectedMake].forEach(model => {
          let option = document.createElement("option");
          option.value = model;
          option.textContent = model;
          modelSelect.appendChild(option);
        });
      } else {
        modelSelect.innerHTML = `<option value="">Select a Make First</option>`;
      }
    });
  
    // In-memory storage for vehicles
    let vehicles = [];
    const storedVehicles = localStorage.getItem("vehicles");
    if (storedVehicles) {
      vehicles = JSON.parse(storedVehicles);
    }
  
    // Update the "My Vehicles" list
    function updateVehicleList() {
      vehicleList.innerHTML = "";
      vehicles.forEach((vehicle, index) => {
        const li = document.createElement("li");
        li.textContent = `${vehicle.make} ${vehicle.model} (Added: ${new Date(vehicle.added).toLocaleDateString()}) `;
  
        //Remove Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
          vehicles.splice(index, 1);
          localStorage.setItem("vehicles", JSON.stringify(vehicles));
          updateVehicleList();
        });
  
        li.appendChild(removeBtn);
        vehicleList.appendChild(li);
      });
    }
  
    updateVehicleList();
  
    // "Add Vehicle" button
    addVehicleButton.addEventListener("click", function() {
      const selectedMake = makeSelect.value;
      const selectedModel = modelSelect.value;
  
      if (!selectedMake || !selectedModel) {
        alert("Please select both a make and model.");
        return;
      }
  
      const vehicle = {
        make: selectedMake,
        model: selectedModel,
        added: new Date().toISOString()
      };
  
      vehicles.push(vehicle);
      localStorage.setItem("vehicles", JSON.stringify(vehicles));
      updateVehicleList();
  
      alert(`Vehicle added: ${selectedMake} ${selectedModel}`);
    });
  });
  