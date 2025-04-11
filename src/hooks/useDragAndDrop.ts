import { useState } from 'react';

const useDragAndDrop = (initialSchedule) => {
    const [schedule, setSchedule] = useState(initialSchedule);
    const [draggedFlight, setDraggedFlight] = useState(null);

    const handleDragStart = (flight) => {
        setDraggedFlight(flight);
    };

    const handleDrop = (day, timeSlot) => {
        if (draggedFlight) {
            const updatedSchedule = { ...schedule };
            updatedSchedule[day][timeSlot] = draggedFlight;
            setSchedule(updatedSchedule);
            setDraggedFlight(null);
        }
    };

    const handleDragEnd = () => {
        setDraggedFlight(null);
    };

    return {
        schedule,
        handleDragStart,
        handleDrop,
        handleDragEnd,
    };
};

export default useDragAndDrop;