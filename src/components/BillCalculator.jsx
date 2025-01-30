import React, { useState, useEffect } from 'react';

    const defaultSlabRates = {
      slab1: [
        { min: 1, max: 100, rate: 0 },
        { min: 101, max: 200, rate: 2.35 },
        { min: 201, max: 400, rate: 4.7 },
        { min: 401, max: 500, rate: 6.3 },
      ],
      slab2: [
        { min: 1, max: 100, rate: 0 },
        { min: 101, max: 400, rate: 4.7 },
        { min: 401, max: 500, rate: 6.3 },
        { min: 501, max: 600, rate: 8.4 },
        { min: 601, max: 800, rate: 9.45 },
        { min: 801, max: 1000, rate: 10.5 },
        { min: 1001, max: Infinity, rate: 11.55 },
      ],
    };

    function BillCalculator() {
      const [previousReading, setPreviousReading] = useState('');
      const [currentReading, setCurrentReading] = useState('');
      const [billAmount, setBillAmount] = useState(null);
      const [slabRates, setSlabRates] = useState(defaultSlabRates);

      useEffect(() => {
        const storedRates = localStorage.getItem('slabRates');
        if (storedRates) {
          setSlabRates(JSON.parse(storedRates));
        }
      }, []);

      const calculateBill = () => {
        const prev = parseFloat(previousReading);
        const curr = parseFloat(currentReading);

        if (isNaN(prev) || isNaN(curr) || curr < prev) {
          setBillAmount(null);
          return;
        }

        const units = curr - prev;
        let amount = 0;

        if (units <= 500) {
          for (const slab of slabRates.slab1) {
            if (units > slab.min) {
              const unitsInSlab = Math.min(units, slab.max) - slab.min;
              amount += unitsInSlab * slab.rate;
            }
          }
        } else {
          for (const slab of slabRates.slab2) {
            if (units > slab.min) {
              const unitsInSlab = Math.min(units, slab.max) - slab.min;
              amount += unitsInSlab * slab.rate;
            }
          }
        }

        setBillAmount(amount.toFixed(2));
      };

      return (
        <div>
          <h2>Bill Calculator</h2>
          <div className="form-group">
            <label>Previous Reading:</label>
            <input
              type="number"
              value={previousReading}
              onChange={(e) => setPreviousReading(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Current Reading:</label>
            <input
              type="number"
              value={currentReading}
              onChange={(e) => setCurrentReading(e.target.value)}
            />
          </div>
          <button onClick={calculateBill}>Calculate Bill</button>
          {billAmount !== null && (
            <p>
              <strong>Bill Amount:</strong> {billAmount}
            </p>
          )}
          {billAmount === null && previousReading !== '' && currentReading !== '' && (
            <p>Please enter valid readings.</p>
          )}
        </div>
      );
    }

    export default BillCalculator;
