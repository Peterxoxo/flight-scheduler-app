import React from 'react';
import { ScheduleProvider } from './context/ScheduleContext';
import ScheduleGrid from './components/ScheduleGrid';
import Timeline from './components/Timeline';

const App: React.FC = () => {
  return (
    <ScheduleProvider>
      <div className="app">
        <h1>Flight Scheduler</h1>
        <ScheduleGrid />
        <Timeline />
      </div>
    </ScheduleProvider>
  );
};

export default App;