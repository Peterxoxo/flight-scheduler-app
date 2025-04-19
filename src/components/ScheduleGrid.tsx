import React, { useState } from 'react';
import './ScheduleGrid.css';

interface ScheduleGridProps {
    nrOfCabinCrew: number; // Number of cabin crew columns in the calendar
    daysInMonth: number; // Number of days in the month
    onFlightDrop: (flightId: number) => void; // Callback to remove flight from the flight list
}

interface MarkedHour {
    isMarked: boolean;
    airport?: string; // Airport information (departure or destination)
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ nrOfCabinCrew, daysInMonth, onFlightDrop }) => {
    const [hoveredHours, setHoveredHours] = useState<{ [key: string]: boolean }>({}); // Track hovered hours
    const [markedHours, setMarkedHours] = useState<{ [key: string]: MarkedHour }>({}); // Track marked hours with airport info

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allow dropping
    };

    const handleDragEnter = (dayIndex: number, crewIndex: number, flight: { takeOffTime: string; landingTime: string }) => {
        const startHour = parseInt(flight.takeOffTime.split(':')[0], 10);
        const endHour = parseInt(flight.landingTime.split(':')[0], 10);

        const newHoveredHours: { [key: string]: boolean } = {};
        for (let hour = startHour; hour <= endHour; hour++) {
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

        // Check if any of the target cells are already marked
        for (let hour = startHour; hour <= endHour; hour++) {
            const cellKey = `${dayIndex}-${crewIndex}-${hour}`;
            if (markedHours[cellKey]?.isMarked) {
                console.error('Cannot add a flight to an already chosen hour-cell');
                return;
            }
        }

        // Check if the departure airport matches the previous flight's arrival airport
        const previousArrivalKey = `${dayIndex}-${crewIndex}-${startHour - 1}`;
        const previousArrivalAirport = markedHours[previousArrivalKey]?.airport;
        if (previousArrivalAirport && previousArrivalAirport !== flight.departureAirport) {
            console.error(
                `The departure airport (${flight.departureAirport}) does not match the previous arrival airport (${previousArrivalAirport})`
            );
            return;
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
                                const markedHour = markedHours[cellKey];

                                return (
                                    <div
                                        key={hourIndex}
                                        className={`hour-item ${isHovered ? 'hovered' : ''} ${markedHour?.isMarked ? 'marked' : ''}`}
                                    >
                                        <div className="time">{hour}</div> {/* Always show the time */}
                                        {markedHour?.airport && <div className="airport">{markedHour.airport}</div>} {/* Show airport if marked */}
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