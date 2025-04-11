import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import FlightCard from './FlightCard';
import './ScheduleGrid.css';

const ScheduleGrid: React.FC = () => {
    const { schedule } = useSchedule();
    const { onDragStart, onDrop } = useDragAndDrop();

    return (
        <div className="schedule-grid">
            {schedule.map((day, dayIndex) => (
                <div key={dayIndex} className="day-column">
                    <h3>{`Day ${dayIndex + 1}`}</h3>
                    <div
                        className="timeline"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDrop(e, dayIndex)}
                    >
                        {day.flights.map((flight, flightIndex) => (
                            <FlightCard
                                key={flight.id}
                                flight={flight}
                                onDragStart={(e) => onDragStart(e, flight, dayIndex, flightIndex)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScheduleGrid;