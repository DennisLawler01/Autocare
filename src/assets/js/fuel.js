document.addEventListener("DOMContentLoaded", function () {
  const fuelForm = document.getElementById("fuel-form");
  const dateInput = document.getElementById("date");
  const odometerInput = document.getElementById("odometer");
  const fuelAmountInput = document.getElementById("fuel-amount");
  const costInput = document.getElementById("cost");
  const fuelList = document.getElementById("fuel-list");

  // Create and insert summary display
  const summary = document.createElement("div");
  summary.id = "fuel-summary";
  fuelForm.insertAdjacentElement("afterend", summary);

  // Get selected vehicle from URL
  const params = new URLSearchParams(window.location.search);
  const year = params.get("year");
  const make = params.get("make");
  const model = params.get("model");
  const trim = params.get("trim");

  const vehicleKey = `${year}_${make}_${model}_${trim}`;
  let fuelStops = JSON.parse(localStorage.getItem(`fuelStops_${vehicleKey}`)) || [];

  function updateFuelList() {
    fuelList.innerHTML = "";
    summary.innerHTML = "";

    if (fuelStops.length === 0) return;

    let totalCost = 0;
    let totalMiles = 0;
    let totalGallons = 0;

    const reversedStops = [...fuelStops].reverse();

    reversedStops.forEach((stop, index) => {
      const realIndex = fuelStops.length - 1 - index;
      let mpg = null;

      if (realIndex > 0) {
        const previousStop = fuelStops[realIndex - 1];
        const distance = stop.odometer - previousStop.odometer;
        mpg = stop.fuelAmount > 0 ? (distance / stop.fuelAmount).toFixed(2) : "N/A";

        if (!isNaN(distance)) {
          totalMiles += distance;
          totalGallons += stop.fuelAmount;
        }
      }

      totalCost += stop.cost;

      const li = document.createElement("li");
      li.textContent = `Date: ${stop.date}, Odometer: ${stop.odometer}, Fuel: ${stop.fuelAmount} gal, Cost: $${stop.cost.toFixed(2)}` +
        (mpg !== null ? `, MPG: ${mpg}` : "");

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        fuelStops.splice(realIndex, 1);
        localStorage.setItem(`fuelStops_${vehicleKey}`, JSON.stringify(fuelStops));
        updateFuelList();
      });

      li.appendChild(removeBtn);
      fuelList.appendChild(li);
    });

    const avgMPG = totalGallons > 0 ? (totalMiles / totalGallons).toFixed(2) : "N/A";

    summary.innerHTML = `
      <h3>Summary</h3>
      <p>Total Cost: $${totalCost.toFixed(2)}</p>
      <p>Average MPG: ${avgMPG}</p>
    `;
  }

  updateFuelList();

  fuelForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const dateValue = dateInput.value;
    const odometerValue = parseFloat(odometerInput.value);
    const fuelAmountValue = parseFloat(fuelAmountInput.value);
    const costValue = parseFloat(costInput.value);

    if (!dateValue || isNaN(odometerValue) || isNaN(fuelAmountValue) || isNaN(costValue)) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    const fuelStop = {
      date: dateValue,
      odometer: odometerValue,
      fuelAmount: fuelAmountValue,
      cost: costValue
    };

    fuelStops.push(fuelStop);
    localStorage.setItem(`fuelStops_${vehicleKey}`, JSON.stringify(fuelStops));
    updateFuelList();
    fuelForm.reset();
  });
});
