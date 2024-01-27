export const formatCurrency = (number: number) => {
    const formattedNumber = Number(number).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return formattedNumber;
}