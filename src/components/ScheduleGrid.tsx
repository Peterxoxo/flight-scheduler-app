import React, { useState } from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrOfCabinCrew: number; // Number of cabin crew columns in the calendar
    daysInMonth: number; // Number of days in the month
    onFlightDrop: (flightId: number) => void; // Callback to remove flight from the flight list
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrOfCabinCrew, daysInMonth, onFlightDrop }) => {
    const [markedCells, setMarkedCells] = useState<{ [key: string]: boolean }>({});
    const [hoveredCell, setHoveredCell] = useState<string | null>(null); // Track the hovered cell

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allow dropping
        console.log('Drag over event:', event); // Debugging log
    };

    const handleDragEnter = (dayIndex: number, crewIndex: number) => {
        setHoveredCell(`${dayIndex}-${crewIndex}`); // Set the hovered cell
    };

    const handleDragLeave = () => {
        setHoveredCell(null); // Clear the hovered cell
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, dayIndex: number, crewIndex: number) => {
        event.preventDefault();

        // Retrieve flight data from dataTransfer
        const flightData = event.dataTransfer.getData('flight');
        console.log('Raw flight data:', flightData); // Debugging log
        if (!flightData) {
            console.error('No flight data found in dataTransfer');
            return;
        }

        // Parse flight data
        const flight = JSON.parse(flightData);
        console.log('Parsed flight:', flight); // Debugging log

        // Calculate the time range to mark
        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);
        console.log(`Start Hour: ${startHour}, End Hour: ${endHour}`); // Debugging log

        // Mark the cells for the flight's duration
        const newMarkedCells = { ...markedCells };
        for (let hour = startHour; hour < endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            newMarkedCells[cellKey] = true;
        }
        console.log('New marked cells:', newMarkedCells); // Debugging log
        setMarkedCells(newMarkedCells);

        // Notify parent to remove the flight from the flight list
        console.log(`Dropping flight with ID: ${flight.id}, Take-Off: ${flight.takeOffTime}, Landing: ${flight.landingTime}, Dropped on Day: ${dayIndex + 1}, Crew: ${crewIndex + 1}`); // System output log
        onFlightDrop(flight.id);

        // Clear the hovered cell
        setHoveredCell(null);
    };

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
                    {Array.from({ length: nrOfCabinCrew }, (_, crewIndex) => {
                        const cellKey = `${dayIndex}-${crewIndex}`;
                        const isHovered = hoveredCell === cellKey;
                        const isMarked = markedCells[cellKey];

                        return (
                            <div
                                key={crewIndex}
                                className={`hour-cell ${isHovered ? 'hovered' : ''} ${isMarked ? 'marked' : ''}`}
                                onDragOver={handleDragOver}
                                onDragEnter={() => handleDragEnter(dayIndex, crewIndex)}
                                onDragLeave={handleDragLeave}
                                onDrop={(event) => handleDrop(event, dayIndex, crewIndex)}
                            >
                                {hours.map((hour, hourIndex) => {
                                    const cellKey = `${dayIndex}-${crewIndex}-${hourIndex}`;
                                    const isMarked = markedCells[cellKey];
                                    return (
                                        <div
                                            key={hourIndex}
                                            className={`hour-item ${isMarked ? 'marked' : ''}`}
                                        >
                                            {hour}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default ScheduleGrid;