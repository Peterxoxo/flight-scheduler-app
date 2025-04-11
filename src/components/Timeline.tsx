import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import './Timeline.css';

const Timeline: React.FC = () => {
    const { schedule } = useSchedule();

    const renderTimeline = () => {
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return daysOfWeek.map((day, dayIndex) => (
            <div key={day} className="day-column">
                <div className="day-header">{day}</div>
                {hours.map((hour) => (
                    <div key={hour} className="hour-slot">
                        {schedule[dayIndex]?.[hour]?.map((flight) => (
                            <div key={flight.id} className="flight-item">
                                {flight.details}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div className="timeline">
            {renderTimeline()}
        </div>
    );
};

export default Timeline;