import React from 'react';
import './FlightGrid.css';

interface Flight {
    id: number;
    takeOffTime: string;
    landingTime: string;
    departureAirport: string;
    destinationAirport: string;
}

interface FlightGridProps {
    flights: Flight[]; // Flights passed from the parent
    onDragStart: (flight: Flight) => (event: React.DragEvent<HTMLDivElement>) => void; // Callback for drag start
    onDragEnd: () => void;
    onFlightDrop: () => void; // Callback for flight drop
}

const FlightGrid: React.FC<FlightGridProps> = ({ flights, onDragStart, onDragEnd, onFlightDrop }) => {
    const handleFlightDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent default behavior
        onFlightDrop(); // Notify the parent to cancel the overlay
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Allow dropping
    };

    return (
        <div className="flight-grid" onDrop={handleFlightDrop} onDragOver={handleDragOver}>
            {/* Header Row */}
            <div className="flight-header">
                <div className="flight-header-item">Take-Off Time</div>
                <div className="flight-header-item">Landing Time</div>
                <div className="flight-header-item">Departure Airport</div>
                <div className="flight-header-item">Destination Airport</div>
            </div>

            {/* Flight Rows */}
            {flights.map((flight) => (
                <div
                    key={flight.id}
                    className="flight-row"
                    draggable
                    onDragStart={onDragStart(flight)} // Pass the flight to the parent on drag start
                    onDragEnd={onDragEnd} // Notify the parent when dragging ends
                >
                    <div className="flight-cell">{flight.takeOffTime}</div>
                    <div className="flight-cell">{flight.landingTime}</div>
                    <div className="flight-cell">{flight.departureAirport}</div>
                    <div className="flight-cell">{flight.destinationAirport}</div>
                </div>
            ))}
        </div>
    );
};

export default FlightGrid;