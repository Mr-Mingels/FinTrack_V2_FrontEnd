export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };

    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}
