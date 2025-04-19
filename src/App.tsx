import React, { useState } from 'react';
import ScheduleGrid from './components/ScheduleGrid';
import FlightGrid from './components/FlightGrid';
import './App.css'; // Add styles for the overlay here

const App: React.FC = () => {
    const [nrOfCabinCrew, setNrOfCabinCrew] = useState(4);
    const [flights, setFlights] = useState([
      { id: 1, takeOffTime: '06:00', landingTime: '07:00', departureAirport: 'ARN', destinationAirport: 'GOT' },
      { id: 2, takeOffTime: '08:00', landingTime: '09:00', departureAirport: 'ARN', destinationAirport: 'MMX' },
      { id: 3, takeOffTime: '10:00', landingTime: '11:00', departureAirport: 'ARN', destinationAirport: 'UME' },
      { id: 4, takeOffTime: '12:00', landingTime: '15:00', departureAirport: 'ARN', destinationAirport: 'LHR' },
      { id: 5, takeOffTime: '14:00', landingTime: '15:00', departureAirport: 'ARN', destinationAirport: 'LLA' },
      { id: 6, takeOffTime: '16:00', landingTime: '17:00', departureAirport: 'ARN', destinationAirport: 'OSD' },
      { id: 7, takeOffTime: '18:00', landingTime: '01:00', departureAirport: 'ARN', destinationAirport: 'JFK' },
      { id: 8, takeOffTime: '20:00', landingTime: '21:00', departureAirport: 'ARN', destinationAirport: 'VBY' },
      { id: 9, takeOffTime: '08:00', landingTime: '09:00', departureAirport: 'GOT', destinationAirport: 'ARN' },
      { id: 10, takeOffTime: '10:00', landingTime: '11:00', departureAirport: 'MMX', destinationAirport: 'ARN' },
      { id: 11, takeOffTime: '12:00', landingTime: '13:00', departureAirport: 'UME', destinationAirport: 'ARN' },
      { id: 12, takeOffTime: '16:00', landingTime: '18:00', departureAirport: 'LHR', destinationAirport: 'ARN' },
      { id: 13, takeOffTime: '17:00', landingTime: '18:00', departureAirport: 'LLA', destinationAirport: 'ARN' },
      { id: 14, takeOffTime: '19:00', landingTime: '20:00', departureAirport: 'OSD', destinationAirport: 'ARN' },
      { id: 15, takeOffTime: '07:00', landingTime: '13:00', departureAirport: 'JFK', destinationAirport: 'ARN' },
      { id: 16, takeOffTime: '22:00', landingTime: '23:00', departureAirport: 'VBY', destinationAirport: 'ARN' },
  ]);
    const [isDragging, setIsDragging] = useState(false); // Track dragging state

    const handleDragStart = (flight: { id: number }) => {
        return (event: React.DragEvent<HTMLDivElement>) => {
            setIsDragging(true); // Set dragging state to true
            console.log('Setting flight data on drag start:', flight); // Debugging log
            event.dataTransfer.setData('flight', JSON.stringify(flight)); // Use 'flight' as the key
        };
    };

    const handleDragEnd = () => {
        setIsDragging(false); // Reset dragging state
    };

    const handleFlightDrop = (flightId: number) => {
        setFlights((prevFlights) => prevFlights.filter((flight) => flight.id !== flightId));
        setIsDragging(false); // Reset dragging state after drop
    };

    return (
        <div className="app">
            {isDragging && <div className="overlay"></div>} {/* Show overlay during drag */}
            <h1>Flight Scheduler</h1>
            <div>
                <label>Number of Cabin Crew: </label>
                <input
                    type="number"
                    value={nrOfCabinCrew}
                    onChange={(e) => setNrOfCabinCrew(Number(e.target.value))}
                    min="1"
                />
            </div>
            <ScheduleGrid
                nrOfCabinCrew={nrOfCabinCrew}
                daysInMonth={10}
                onFlightDrop={handleFlightDrop}
                isDragging={isDragging} // Pass isDragging to ScheduleGrid
            />
            <FlightGrid flights={flights} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onFlightDrop={handleDragEnd} />
        </div>
    );
};

export default App;