import React, { useState } from 'react';
import ScheduleGrid from './components/ScheduleGrid';
import FlightGrid from './components/FlightGrid';

const App: React.FC = () => {
    const [nrOfCabinCrew, setNrOfCabinCrew] = useState(4);
    const [flights, setFlights] = useState([
        { id: 1, takeOffTime: '08:00', landingTime: '10:00', departureAirport: 'JFK', destinationAirport: 'LAX' },
        { id: 2, takeOffTime: '12:00', landingTime: '14:00', departureAirport: 'ORD', destinationAirport: 'ATL' },
        { id: 3, takeOffTime: '15:00', landingTime: '18:00', departureAirport: 'SFO', destinationAirport: 'SEA' },
        { id: 4, takeOffTime: '09:00', landingTime: '13:00', departureAirport: 'LHR', destinationAirport: 'DXB' },
        { id: 5, takeOffTime: '11:00', landingTime: '15:00', departureAirport: 'CDG', destinationAirport: 'HND' },
    ]);

    const handleDragStart = (flight: { id: number }) => {
        return (event: React.DragEvent<HTMLDivElement>) => {
            console.log('Setting flight data on drag start:', flight); // Debugging log
            event.dataTransfer.setData('flight', JSON.stringify(flight)); // Use 'flight' as the key
        };
    };

    const handleFlightDrop = (flightId: number) => {
        setFlights((prevFlights) => prevFlights.filter((flight) => flight.id !== flightId));
    };

    return (
        <div>
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
            <ScheduleGrid nrOfCabinCrew={nrOfCabinCrew} daysInMonth={10} onFlightDrop={handleFlightDrop} />
            <FlightGrid flights={flights} onDragStart={handleDragStart} />
        </div>
    );
};

export default App;