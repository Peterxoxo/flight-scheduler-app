import React, { useState } from 'react';
import ScheduleGrid from './components/ScheduleGrid';

const App: React.FC = () => {
    const [nrOfCabinCrew, setNrOfCabinCrew] = useState(4); // Default value is 5

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    return (
        <div>
            <h1>Flight Scheduler</h1>

            {/* Input to change the number of cabin crew */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="cabinCrewInput">Number of Cabin Crew: </label>
                <input
                    id="cabinCrewInput"
                    type="number"
                    value={nrOfCabinCrew}
                    onChange={(e) => setNrOfCabinCrew(Number(e.target.value))}
                    min="1"
                    style={{ width: '50px', marginLeft: '10px' }}
                />
            </div>
            <ScheduleGrid nrOfCabinCrew={nrOfCabinCrew} daysInMonth={30} />
        </div>
    );
};

export default App;