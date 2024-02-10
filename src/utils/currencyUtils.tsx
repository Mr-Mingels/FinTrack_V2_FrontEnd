export const formatCurrency = (number: number) => {
    const hasDecimal = number % 1 !== 0;

    const formattedNumber = Number(number).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: hasDecimal ? 2 : 0,
        maximumFractionDigits: 2
    });
    
    return formattedNumber;
}
