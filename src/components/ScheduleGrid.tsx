import React, { useState } from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrOfCabinCrew: number; // Number of cabin crew columns in the calendar
    daysInMonth: number; // Number of days in the month
    onFlightDrop: (flightId: number) => void; // Callback to remove flight from the flight list
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrOfCabinCrew, daysInMonth, onFlightDrop }) => {
    const [hoveredHours, setHoveredHours] = useState<{ [key: string]: boolean }>({}); // Track hovered hours
    const [markedHours, setMarkedHours] = useState<{ [key: string]: boolean }>({}); // Track marked hours

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allow dropping
    };

    const handleDragEnter = (dayIndex: number, crewIndex: number, flight: { takeOffTime: string; landingTime: string }) => {
        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);

        const newHoveredHours: { [key: string]: boolean } = {};
        for (let hour = startHour; hour < endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            newHoveredHours[cellKey] = true;
        }
        setHoveredHours(newHoveredHours); // Highlight only the affected hours
    };

    const handleDragLeave = () => {
        setHoveredHours({}); // Clear the hovered hours
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, dayIndex: number, crewIndex: number) => {
        event.preventDefault();

        const flightData = event.dataTransfer.getData('flight');
        if (!flightData) {
            console.error('No flight data found in dataTransfer');
            return;
        }

        const flight = JSON.parse(flightData);

        // Validate that the flight's take-off time matches the drop location
        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);

        const dropHour = dayIndex * 24 + startHour; // Calculate the hour on the grid
        if (dropHour % 24 !== startHour) {
            console.error('Flight take-off time does not match the drop location');
            return;
        }

        // Mark the hours for the dropped flight, including the landing hour
        const newMarkedHours = { ...markedHours };
        for (let hour = startHour; hour <= endHour; hour++) { // Use <= to include endHour
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            newMarkedHours[cellKey] = true;
        }
        setMarkedHours(newMarkedHours);

        // Notify parent to remove the flight from the flight list
        onFlightDrop(flight.id);

        // Clear the hovered hours
        setHoveredHours({});
    };

    const generate24Hours = (): string[] => {
        return Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, '0')}:00`);
    };

    const hours = generate24Hours();

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
                        <div
                            key={crewIndex}
                            className="hour-cell"
                            onDragOver={handleDragOver}
                            onDragEnter={(event) => {
                                const flightData = event.dataTransfer.getData('flight');
                                if (flightData) {
                                    const flight = JSON.parse(flightData);
                                    handleDragEnter(dayIndex, crewIndex, flight);
                                }
                            }}
                            onDragLeave={handleDragLeave}
                            onDrop={(event) => handleDrop(event, dayIndex, crewIndex)}
                        >
                            {hours.map((hour, hourIndex) => {
                                const cellKey = `${dayIndex}-${crewIndex}-${hourIndex}`;
                                const isHovered = hoveredHours[cellKey];
                                const isMarked = markedHours[cellKey];

                                return (
                                    <div
                                        key={hourIndex}
                                        className={`hour-item ${isHovered ? 'hovered' : ''} ${isMarked ? 'marked' : ''}`}
                                    >
                                        {hour}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ScheduleGrid;