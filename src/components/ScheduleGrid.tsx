import React from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrofCabinCrew: number; // Number of columns in the schedule
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrofCabinCrew }) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

    return (
        <div className="schedule-grid">
            {/* Render the header row with crew labels */}
            <div className="schedule-header">
                <div className="empty-cell"></div>
                {Array.from({ length: nrofCabinCrew }, (_, crewIndex) => (
                    <div key={crewIndex} className="crew-header">
                        {`Crew ${crewIndex + 1}`}
                    </div>
                ))}
            </div>

            {/* Render the schedule grid */}
            <div className="schedule-body">
                {daysOfWeek.map((day) => (
                    <div key={day} className="day-row">
                        <div className="day-label">{day}</div>
                        {Array.from({ length: nrofCabinCrew }, (_, crewIndex) => (
                            <div key={crewIndex} className="crew-column">
                                {hours.map((hour) => (
                                    <div
                                        key={`${day}-${hour}-${crewIndex}`}
                                        className="hour-slot"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            const flightData = e.dataTransfer.getData('flight');
                                            console.log(
                                                `Dropped flight on Crew ${crewIndex + 1}, ${day} at ${hour}:00`,
                                                flightData
                                            );
                                        }}
                                    >
                                        {`${hour}:00`}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleGrid;