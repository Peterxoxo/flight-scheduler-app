import React from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrOfCabinCrew: number; // Number of cabin crew columns in the calendar
    daysInMonth: number; // Number of days in the month
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrOfCabinCrew, daysInMonth }) => {
    const generate24Hours = (): string[] => {
        return Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, '0')}:00`);
    };

    const hours = generate24Hours(); // Generate the 24-hour format once

    return (
        <div className="schedule-grid">
            <div className="schedule-header">
                <div className="crew-header"></div>
                {Array.from({ length: nrOfCabinCrew }, (_, crewIndex) => (
                    <div key={crewIndex} className="crew-header">
                        {`Crew ${crewIndex + 1}`}
                    </div>
                ))}
            </div>

            {/* Render the schedule body */}
            {Array.from({ length: daysInMonth }, (_, dayIndex) => (
                <div key={dayIndex} className="day-row">
                    {/* Day label */}
                    <div className="day-label">{`Day ${dayIndex + 1}`}</div>

                    {/* Display all 24 hours for each cabin crew */}
                    {Array.from({ length: nrOfCabinCrew }, (_, crewIndex) => (
                        <div key={crewIndex} className="hour-cell">
                            {hours.map((hour, hourIndex) => (
                                <div key={hourIndex} className="hour-item">
                                    {hour}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ScheduleGrid;