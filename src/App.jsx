import React, { useState } from 'react';
    import BillCalculator from './components/BillCalculator';
    import RateEditor from './components/RateEditor';

    function App() {
      const [activeTab, setActiveTab] = useState('calculator');

      const handleTabChange = (tab) => {
        setActiveTab(tab);
      };

      return (
        <div>
          <div className="tab-container">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => handleTabChange('calculator')}
              >
                Bill Calculator
              </button>
              <button
                className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => handleTabChange('editor')}
              >
                Rate Editor
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'calculator' ? <BillCalculator /> : <RateEditor />}
            </div>
          </div>
        </div>
      );
    }

    export default App;
