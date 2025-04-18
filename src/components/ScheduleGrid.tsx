import React from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrOfCabinCrew: number; // Number of cabin crew rows in the calendar
    daysInMonth: number; // Number of days in the month
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrOfCabinCrew, daysInMonth }) => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="schedule-grid">
            {/* Render the header row */}
            <div className="schedule-header">
                <div className="crew-header">Cabin Crew</div>
                {Array.from({ length: daysInMonth }, (_, dayIndex) => (
                    <div key={dayIndex} className="day-header">
                        {`Day ${dayIndex + 1}`}
                    </div>
                ))}
            </div>

            {/* Render the schedule body */}
            {Array.from({ length: nrOfCabinCrew }, (_, crewIndex) => (
                <div
                    key={crewIndex}
                    className={`crew-row ${crewIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}
                >
                    {/* Cabin crew label */}
                    <div className="crew-label">{`Crew ${crewIndex + 1}`}</div>

                    {/* Days of the week */}
                    {Array.from({ length: daysInMonth }, (_, dayIndex) => (
                        <div key={dayIndex} className="day-cell">
                            {daysOfWeek[dayIndex % 7]} {/* Display the day of the week */}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ScheduleGrid;