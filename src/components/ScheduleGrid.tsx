import React, { useState } from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrOfCabinCrew: number; // Number of cabin crew columns in the calendar
    daysInMonth: number; // Number of days in the month
    onFlightDrop: (flightId: number) => void; // Callback to remove flight from the flight list
    isDragging: boolean; // Track if a flight is being dragged}
}
interface MarkedHour {
    isMarked: boolean;
    airport?: string; // Airport information (departure or destination)
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrOfCabinCrew, daysInMonth, onFlightDrop, isDragging }) => {
    const [hoveredCell, setHoveredCell] = useState<string[]>([]); // Track the hovered cell
    const [markedHours, setMarkedHours] = useState<{ [key: string]: MarkedHour }>({}); // Track marked hours with airport info
    const [crewCurrentAirport, setCrewCurrentAirport] = useState<{ [key: number]: string }>({}); // Track current airport for each crew
    const [declinedCells, setDeclinedCells] = useState<string[]>([]); // Track cells where a flight was declined

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allow dropping
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>, dayIndex: number, crewIndex: number) => {
        if (!isDragging) return; // Only apply hover effect when dragging

        const flightData = event.dataTransfer.getData('flight');
        if (!flightData) {
            console.error('No flight data found in dataTransfer');
            return;
        }

        const flight = JSON.parse(flightData);

        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);

        const hoveredCells = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            hoveredCells.push(cellKey);
        }

        setHoveredCell(hoveredCells); // Set all the cells in the range as hovered
    };

    const handleDragLeave = (dayIndex: number, crewIndex: number, hourIndex: number) => {
        if (!isDragging) return; // Only apply hover effect when dragging
        const cellKey = `${dayIndex}-${crewIndex}-${hourIndex}`;
        setHoveredCell((prev) => prev.filter((key) => key !== cellKey)); // Remove the cell from the hovered list
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, dayIndex: number, crewIndex: number) => {
        event.preventDefault();

        const flightData = event.dataTransfer.getData('flight');
        if (!flightData) {
            console.error('No flight data found in dataTransfer');
            return;
        }

        const flight = JSON.parse(flightData);

        // Validate that the flight's departure airport matches the crew's current airport
        const currentAirport = crewCurrentAirport[crewIndex];
        if (currentAirport && currentAirport !== flight.departureAirport) {
            console.error(
                `The departure airport (${flight.departureAirport}) does not match the crew's current airport (${currentAirport})`
            );
            highlightDeclinedCells(dayIndex, crewIndex, flight); // Highlight declined cells
            return;
        }

        // Validate that the flight's take-off time matches the drop location
        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);

        // Check if any of the target cells are already marked
        for (let hour = startHour; hour <= endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            if (markedHours[cellKey]?.isMarked) {
                console.error('Cannot add a flight to an already chosen hour-cell');
                highlightDeclinedCells(dayIndex, crewIndex, flight); // Highlight declined cells
                return;
            }
        }

        // Mark the hours for the dropped flight
        const newMarkedHours = { ...markedHours };
        for (let hour = startHour; hour <= endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            newMarkedHours[cellKey] = {
                isMarked: true,
                airport:
                    hour === startHour
                        ? flight.departureAirport // Show departure airport on the first hour
                        : hour === endHour
                        ? flight.destinationAirport // Show destination airport on the last hour
                        : undefined, // No airport for intermediate hours
            };
        }
        setMarkedHours(newMarkedHours);

        // Update the crew's current airport to the flight's destination airport
        setCrewCurrentAirport((prev) => ({
            ...prev,
            [crewIndex]: flight.destinationAirport,
        }));

        // Notify parent to remove the flight from the flight list
        onFlightDrop(flight.id);

        // Clear the hovered cell
        setHoveredCell([]);
    };

    const highlightDeclinedCells = (
        dayIndex: number,
        crewIndex: number,
        flight: { takeOffTime: string; landingTime: string }
    ) => {
        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);

        const declined = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            declined.push(cellKey);
        }

        // Find the last marked hour for the crew
        let previousHourKey = null;
        for (let hour = startHour - 1; hour >= 0; hour--) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            if (markedHours[cellKey]?.airport) {
                previousHourKey = cellKey;
                break;
            }
        }

        // Add the previous destination airport cell to the declined list
        if (previousHourKey) {
            declined.push(previousHourKey);
        }

        setDeclinedCells(declined); // Highlight the declined cells

        // Clear the declined cells after a delay
        setTimeout(() => {
            setDeclinedCells([]);
        }, 2000); // 2 seconds delay
    };

    const hours = Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, '0')}:00`);

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
                            {hours.map((hour, hourIndex) => {
                                const cellKey = `${dayIndex}-${crewIndex}-${hourIndex}`;
                                const isHovered = isDragging && hoveredCell.includes(cellKey); // Only hover when dragging
                                const isDeclined = declinedCells.includes(cellKey); // Highlight declined cells
                                const markedHour = markedHours[cellKey];

                                return (
                                    <div
                                        key={hourIndex}
                                        className={`hour-item ${isHovered ? 'hovered' : ''} ${isDeclined ? 'declined' : ''} ${
                                            markedHour?.isMarked ? 'marked' : ''
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragEnter={(event) => handleDragEnter(event, dayIndex, crewIndex)}
                                        onDragLeave={() => handleDragLeave(dayIndex, crewIndex, hourIndex)}
                                        onDrop={(event) => handleDrop(event, dayIndex, crewIndex)}
                                    >
                                        <div className="time">{hour}</div>
                                        {markedHour?.airport && <div className="airport">{markedHour.airport}</div>}
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