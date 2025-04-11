import React, { createContext, useState, ReactNode } from 'react';

interface Flight {
    id: string;
    from: string;
    to: string;
    time: string;
}

interface ScheduleContextType {
    flights: Flight[];
    addFlight: (flight: Flight) => void;
    removeFlight: (id: string) => void;
    updateFlight: (id: string, updatedFlight: Flight) => void;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [flights, setFlights] = useState<Flight[]>([]);

    const addFlight = (flight: Flight) => {
        setFlights((prevFlights) => [...prevFlights, flight]);
    };

    const removeFlight = (id: string) => {
        setFlights((prevFlights) => prevFlights.filter(flight => flight.id !== id));
    };

    const updateFlight = (id: string, updatedFlight: Flight) => {
        setFlights((prevFlights) => 
            prevFlights.map(flight => (flight.id === id ? updatedFlight : flight))
        );
    };

    return (
        <ScheduleContext.Provider value={{ flights, addFlight, removeFlight, updateFlight }}>
            {children}
        </ScheduleContext.Provider>
    );
};