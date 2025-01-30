const defaultSlabRates = {
      slab1: [
        { min: 1, max: 100, rate: 0, units: 100 },
        { min: 101, max: 400, rate: 2.35, units: 300 },
         { min: 401, max: 410, rate: 6.3, units: 10 },
      ],
      slab2: [
        { min: 1, max: 100, rate: 0, units: 100 },
        { min: 101, max: 400, rate: 4.7, units: 300 },
        { min: 401, max: 500, rate: 6.3, units: 100 },
        { min: 501, max: 600, rate: 8.4, units: 100 },
        { min: 601, max: 800, rate: 9.45, units: 200 },
        { min: 801, max: 1000, rate: 10.5, units: 200 },
        { min: 1001, max: Infinity, rate: 11.55, units: Infinity },
      ],
    };

    let slabRates = JSON.parse(localStorage.getItem('slabRates')) || defaultSlabRates;

    function calculateBill() {
      slabRates = JSON.parse(localStorage.getItem('slabRates')) || defaultSlabRates;

      const previousReadingDate = document.getElementById('previousReadingDate').value;
      const nextBillingDateInput = document.getElementById('nextBillingDateInput').value;
      const previousReading = parseFloat(document.getElementById('previousReading').value);
      const currentReading = parseFloat(document.getElementById('currentReading').value);
      const billAmountDisplay = document.getElementById('billAmount');
      const nextBillingDateDisplay = document.getElementById('nextBillingDate');
      const daysRemainingMeter = document.getElementById('daysRemainingMeter');
      const daysRemainingText = document.getElementById('daysRemainingText');
      const predictedBillAmountDisplay = document.getElementById('predictedBillAmount');
      const averageDailyUsageDisplay = document.getElementById('averageDailyUsage');
      const totalUnitsUsedDisplay = document.getElementById('totalUnitsUsed');
      const predictedUnitsDisplay = document.getElementById('predictedUnits');
      const slabCalculationTableBody = document.querySelector('#slabCalculationTable tbody');

      if (!previousReadingDate || isNaN(previousReading) || isNaN(currentReading) || currentReading < previousReading) {
        billAmountDisplay.textContent = 'Please enter valid readings.';
        nextBillingDateDisplay.textContent = '';
        daysRemainingMeter.style.backgroundImage = '';
        daysRemainingText.textContent = '';
        predictedBillAmountDisplay.textContent = '';
        averageDailyUsageDisplay.textContent = '';
        totalUnitsUsedDisplay.textContent = '';
        predictedUnitsDisplay.textContent = '';
        slabCalculationTableBody.innerHTML = '';
        return;
      }

      const units = currentReading - previousReading;
      let amount = 0;
      let slabDetails = [];
      let remainingUnits = units;

      if (units <= 500) {
        for (const slab of slabRates.slab1) {
          if (remainingUnits > 0) {
            const unitsInSlab = Math.min(remainingUnits, slab.units);
            const slabAmount = unitsInSlab * slab.rate;
            amount += slabAmount;
            slabDetails.push({
              from: slab.min,
              to: slab.max === Infinity ? 'Infinity' : slab.max,
              units: unitsInSlab,
              rate: slab.rate,
              amount: slabAmount.toFixed(2),
            });
            remainingUnits -= unitsInSlab;
          }
        }
      } else {
        for (const slab of slabRates.slab2) {
          if (remainingUnits > 0) {
            const unitsInSlab = Math.min(remainingUnits, slab.units);
            const slabAmount = unitsInSlab * slab.rate;
            amount += slabAmount;
            slabDetails.push({
              from: slab.min,
              to: slab.max === Infinity ? 'Infinity' : slab.max,
              units: unitsInSlab,
              rate: slab.rate,
              amount: slabAmount.toFixed(2),
            });
            remainingUnits -= unitsInSlab;
          }
        }
      }

      billAmountDisplay.textContent = `Bill Amount: ${amount.toFixed(2)}`;

      // Calculate next billing date
      let nextDate;
      if (nextBillingDateInput) {
        nextDate = new Date(nextBillingDateInput);
      } else {
        const prevDate = new Date(previousReadingDate);
        nextDate = new Date(prevDate);
        nextDate.setDate(prevDate.getDate() + 60);
      }
      nextBillingDateDisplay.textContent = nextDate.toLocaleDateString();

      // Calculate days remaining
      const today = new Date();
      const timeDiff = nextDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysRemaining > 0) {
        const percentage = Math.max(0, Math.min(100, (daysRemaining / 60) * 100));
        daysRemainingMeter.style.setProperty('--fill-percentage', `${percentage}%`);
        daysRemainingText.textContent = `${daysRemaining} days`;
      } else {
        daysRemainingMeter.style.backgroundImage = '';
        daysRemainingText.textContent = 'Billing date passed';
      }

      // Calculate daily usage
      const daysSincePrevious = Math.ceil((today.getTime() - new Date(previousReadingDate).getTime()) / (1000 * 3600 * 24));
      const dailyUsage = daysSincePrevious > 0 ? units / daysSincePrevious : 0;

      // Predict bill amount for 60th day
      const predictedUnits = dailyUsage * 60;
      let predictedAmount = 0;
      let predictedRemainingUnits = predictedUnits;

      if (predictedUnits <= 500) {
        for (const slab of slabRates.slab1) {
          if (predictedRemainingUnits > 0) {
            const unitsInSlab = Math.min(predictedRemainingUnits, slab.units);
            predictedAmount += unitsInSlab * slab.rate;
            predictedRemainingUnits -= unitsInSlab;
          }
        }
      } else {
        for (const slab of slabRates.slab2) {
           if (predictedRemainingUnits > 0) {
            const unitsInSlab = Math.min(predictedRemainingUnits, slab.units);
            predictedAmount += unitsInSlab * slab.rate;
            predictedRemainingUnits -= unitsInSlab;
          }
        }
      }

      predictedBillAmountDisplay.textContent = predictedAmount.toFixed(2);
      averageDailyUsageDisplay.textContent = dailyUsage.toFixed(2);
      totalUnitsUsedDisplay.textContent = units.toFixed(2);
      predictedUnitsDisplay.textContent = predictedUnits.toFixed(2);

      // Render slab calculation table
      slabCalculationTableBody.innerHTML = '';
      slabDetails.forEach(detail => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${detail.from}</td>
          <td>${detail.to}</td>
          <td>${detail.units.toFixed(2)}</td>
          <td>${detail.rate}</td>
          <td>${detail.amount}</td>
        `;
        slabCalculationTableBody.appendChild(row);
      });
    }

    function clearForm() {
      document.getElementById('previousReadingDate').value = '';
      document.getElementById('nextBillingDateInput').value = '';
      document.getElementById('previousReading').value = '';
      document.getElementById('currentReading').value = '';
      document.getElementById('billAmount').textContent = '';
      document.getElementById('nextBillingDate').textContent = '';
      document.getElementById('daysRemainingMeter').style.backgroundImage = '';
      document.getElementById('daysRemainingText').textContent = '';
      document.getElementById('predictedBillAmount').textContent = '';
      document.getElementById('averageDailyUsage').textContent = '';
      document.getElementById('totalUnitsUsed').textContent = '';
      document.getElementById('predictedUnits').textContent = '';
      document.querySelector('#slabCalculationTable tbody').innerHTML = '';
    }

    function saveRates() {
      const slab1Table = document.getElementById('slab1-table');
      const slab2Table = document.getElementById('slab2-table');

      const updatedSlab1 = Array.from(slab1Table.querySelectorAll('tbody tr')).map((row, index) => {
        const inputs = row.querySelectorAll('input');
        return {
          min: parseFloat(inputs[0].value),
          max: parseFloat(inputs[1].value),
          rate: parseFloat(inputs[2].value),
          units: defaultSlabRates.slab1[index].units
        };
      });

      const updatedSlab2 = Array.from(slab2Table.querySelectorAll('tbody tr')).map((row, index) => {
        const inputs = row.querySelectorAll('input');
        return {
          min: parseFloat(inputs[0].value),
          max: parseFloat(inputs[1].value) === Infinity ? Infinity : parseFloat(inputs[1].value),
          rate: parseFloat(inputs[2].value),
           units: defaultSlabRates.slab2[index].units
        };
      });

      slabRates = { slab1: updatedSlab1, slab2: updatedSlab2 };
      localStorage.setItem('slabRates', JSON.stringify(slabRates));
    }

    function switchLayout() {
      const layoutSelect = document.getElementById('layout-select');
      const selectedLayout = layoutSelect.value;
      document.body.className = selectedLayout;
      localStorage.setItem('selectedLayout', selectedLayout);
    }

    document.addEventListener('DOMContentLoaded', () => {
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabContents = document.querySelectorAll('.tab-content');

      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tab = button.getAttribute('data-tab');

          tabButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          tabContents.forEach(content => {
            content.style.display = 'none';
          });

          document.getElementById(`${tab}-tab`).style.display = 'block';
        });
      });

      // Initialize rate editor with stored rates
      const slab1Table = document.getElementById('slab1-table');
      const slab2Table = document.getElementById('slab2-table');

      function populateTable(table, slabData) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
          const inputs = row.querySelectorAll('input');
          inputs[0].value = slabData[index].min;
          inputs[1].value = slabData[index].max === Infinity ? 'Infinity' : slabData[index].max;
          inputs[2].value = slabData[index].rate;
        });
      }

      populateTable(slab1Table, slabRates.slab1);
      populateTable(slab2Table, slabRates.slab2);

      // Load saved layout
      const savedLayout = localStorage.getItem('selectedLayout');
      if (savedLayout) {
        document.body.className = savedLayout;
        document.getElementById('layout-select').value = savedLayout;
      }
    });
