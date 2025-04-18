import React from 'react';
import ScheduleGrid from './components/ScheduleGrid';

const App: React.FC = () => {
    return (
        <div>
            <h1>Flight Scheduler</h1>
            <ScheduleGrid nrofCabinCrew={5} />
        </div>
    );
};

export default App;