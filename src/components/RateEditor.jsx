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

    function RateEditor() {
      const [slabRates, setSlabRates] = useState(defaultSlabRates);

      useEffect(() => {
        const storedRates = localStorage.getItem('slabRates');
        if (storedRates) {
          setSlabRates(JSON.parse(storedRates));
        }
      }, []);

      const handleRateChange = (slabName, index, field, value) => {
        const updatedSlabRates = { ...slabRates };
        updatedSlabRates[slabName][index][field] = parseFloat(value);
        setSlabRates(updatedSlabRates);
      };

      const handleSaveRates = () => {
        localStorage.setItem('slabRates', JSON.stringify(slabRates));
      };

      return (
        <div>
          <h2>Rate Editor</h2>
          <h3>Slab 1 (Units up to 500)</h3>
          <table className="rate-table">
            <thead>
              <tr>
                <th>Min Units</th>
                <th>Max Units</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {slabRates.slab1.map((slab, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      value={slab.min}
                      onChange={(e) =>
                        handleRateChange('slab1', index, 'min', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={slab.max === Infinity ? 'Infinity' : slab.max}
                      onChange={(e) =>
                        handleRateChange('slab1', index, 'max', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={slab.rate}
                      onChange={(e) =>
                        handleRateChange('slab1', index, 'rate', e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Slab 2 (Units above 500)</h3>
          <table className="rate-table">
            <thead>
              <tr>
                <th>Min Units</th>
                <th>Max Units</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {slabRates.slab2.map((slab, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      value={slab.min}
                      onChange={(e) =>
                        handleRateChange('slab2', index, 'min', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={slab.max === Infinity ? 'Infinity' : slab.max}
                      onChange={(e) =>
                        handleRateChange('slab2', index, 'max', e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={slab.rate}
                      onChange={(e) =>
                        handleRateChange('slab2', index, 'rate', e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveRates}>Save Rates</button>
        </div>
      );
    }

    export default RateEditor;
