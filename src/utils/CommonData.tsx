export const currency = "₹";
export const capacity = "ℓ";
// Utility function to get the current date in 'YYYY-MM-DD' format
export const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Format month as 'MM'
    const day = now.getDate().toString().padStart(2, '0'); // Format day as 'DD'
    return `${year}-${month}-${day}`;
};

// Utility function to get the current month in 'YYYY-MM' format
export const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Format month as 'MM'
    return `08-${year}`;
};
