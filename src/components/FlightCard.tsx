import React from 'react';

interface FlightCardProps {
    flightNumber: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, flight: FlightCardProps) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flightNumber, from, to, departureTime, arrivalTime, onDragStart }) => {
    return (
        <div 
            className="flight-card" 
            draggable 
            onDragStart={(event) => onDragStart(event, { flightNumber, from, to, departureTime, arrivalTime })}
        >
            <h3>{flightNumber}</h3>
            <p>{from} to {to}</p>
            <p>Departure: {departureTime}</p>
            <p>Arrival: {arrivalTime}</p>
        </div>
    );
};

export default FlightCard;