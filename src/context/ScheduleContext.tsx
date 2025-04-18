import React, { createContext, useState, ReactNode, useContext } from 'react';

export interface Flight {
    id: string;
    from: string;
    to: string;
    departureTime: string; // ISO format or HH:mm
    arrivalTime: string;   // ISO format or HH:mm
}

export type Flights = Flight[];

interface Schedule {
    [dayIndex: number]: {
        [hour: number]: Flight[];
    };
}

interface ScheduleContextType {
    flights: Flights;
    schedule: Schedule;
    addFlight: (flight: Flight) => void;
    removeFlight: (id: string) => void;
    updateFlight: (id: string, updatedFlight: Flight) => void;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [flights, setFlights] = useState<Flights>([]);

    const addFlight = (flight: Flight) => {
        setFlights((prevFlights) => [...prevFlights, flight]);
    };

    const removeFlight = (id: string) => {
        setFlights((prevFlights) => prevFlights.filter((flight) => flight.id !== id));
    };

    const updateFlight = (id: string, updatedFlight: Flight) => {
        setFlights((prevFlights) =>
            prevFlights.map((flight) => (flight.id === id ? updatedFlight : flight))
        );
    };

    // Generate the schedule based on flights
    const schedule: Schedule = flights.reduce((acc, flight) => {
        const departureDate = new Date(flight.departureTime);
        const dayIndex = departureDate.getDay(); // 0 (Sunday) to 6 (Saturday)
        const hour = departureDate.getHours();

        if (!acc[dayIndex]) acc[dayIndex] = {};
        if (!acc[dayIndex][hour]) acc[dayIndex][hour] = [];
        acc[dayIndex][hour].push(flight);

        return acc;
    }, {} as Schedule);

    return (
        <ScheduleContext.Provider value={{ flights, schedule, addFlight, removeFlight, updateFlight }}>
            {children}
        </ScheduleContext.Provider>
    );
};

// Custom hook to use the ScheduleContext
export const useSchedule = (): ScheduleContextType => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useSchedule must be used within a ScheduleProvider');
    }
    return context;
};