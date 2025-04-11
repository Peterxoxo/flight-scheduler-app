export const formatFlightTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const isFlightOverlapping = (flight1: { start: Date; end: Date }, flight2: { start: Date; end: Date }): boolean => {
    return flight1.start < flight2.end && flight2.start < flight1.end;
};

export const getDayOfWeek = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};