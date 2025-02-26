document.addEventListener("DOMContentLoaded", function () {
    const fuelForm = document.getElementById("fuel-form");
    const dateInput = document.getElementById("date");
    const odometerInput = document.getElementById("odometer");
    const fuelAmountInput = document.getElementById("fuel-amount");
    const costInput = document.getElementById("cost");
    const fuelList = document.getElementById("fuel-list");
  
    // In-memory storage for fuel stops
    let fuelStops = [];
    const storedFuelStops = localStorage.getItem("fuelStops");
    if (storedFuelStops) {
      fuelStops = JSON.parse(storedFuelStops);
    }
  
    // Update the fuel list and calculate MPG for each fill up
    function updateFuelList() {
      fuelList.innerHTML = "";
      fuelStops.forEach((stop, index) => {
        // Calculate MPG
        let mpg = null;
        if (index > 0) {
          const previousStop = fuelStops[index - 1];
          const distance = stop.odometer - previousStop.odometer;
          mpg = stop.fuelAmount > 0 ? (distance / stop.fuelAmount).toFixed(2) : "N/A";
        }
        
        // Create a list of fuel stop data
        const li = document.createElement("li");
        li.textContent = `Date: ${stop.date}, Odometer: ${stop.odometer}, Fuel: ${stop.fuelAmount} gal, Cost: $${stop.cost}` +
          (mpg !== null ? `, MPG: ${mpg}` : "");
        
        // Remove Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
          fuelStops.splice(index, 1);
          localStorage.setItem("fuelStops", JSON.stringify(fuelStops));
          updateFuelList();
        });
        
        li.appendChild(removeBtn);
        fuelList.appendChild(li);
      });
    }

    updateFuelList();
  
    // Fuel form submit
    fuelForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const dateValue = dateInput.value;
      const odometerValue = parseFloat(odometerInput.value);
      const fuelAmountValue = parseFloat(fuelAmountInput.value);
      const costValue = parseFloat(costInput.value);
      
      // Validate inputs
      if (!dateValue || isNaN(odometerValue) || isNaN(fuelAmountValue) || isNaN(costValue)) {
        alert("Please fill in all fields with valid values.");
        return;
      }
      
      // Create a new fuel stop record
      const fuelStop = {
        date: dateValue,
        odometer: odometerValue,
        fuelAmount: fuelAmountValue,
        cost: costValue
      };
  
      fuelStops.push(fuelStop);
      // Save fuelStops
      localStorage.setItem("fuelStops", JSON.stringify(fuelStops));
      updateFuelList();
      
      fuelForm.reset();
    });
  });
  