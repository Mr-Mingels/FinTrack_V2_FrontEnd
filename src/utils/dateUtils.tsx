export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const currentYear = new Date().getFullYear();
    let currentDay = '';

    if (date.toDateString() === today.toDateString()) {
        currentDay = 'Today, ';
    } else if (date.toDateString() === yesterday.toDateString()) {
        currentDay = 'Yesterday, ';
    }

    const options: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        month: currentDay ? undefined : 'long',
        day: currentDay ? undefined : 'numeric',
        year: date.getFullYear() !== currentYear ? 'numeric' : undefined
    };

    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (currentDay !== '' && date.getFullYear() === currentYear) {
        return currentDay + ' ' + formattedTime;
    } else {
        return currentDay + formattedDate;
    }
}



