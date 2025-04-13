export const isPositiveInteger = (str: string): boolean => {
    if (!str) {
        return false
    }
    const pattern = new RegExp('^[0-9]\\d*$')
    return pattern.test(str)
}

export const getLocalDateString = (date?: Date): string => {
    return date?.toLocaleDateString("en-CA", {year: "numeric", month: "2-digit", day: "2-digit"}) || "";
}


export const isEndDateAfterStartDate = (start_date: string, end_date: string): [boolean, string] => {
    /**
     * Compares two date strings to check if end_date is after start_date
     * @param start_date Date string in format YYYY-MM-DD
     * @param end_date Date string in format YYYY-MM-DD
     * @returns {(string | boolean)[]} validation with description.
     */

    // Handle empty string cases
    if (!start_date || !end_date) {
        return [false, "Dates are required!"]
    }

    // Convert strings to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return [false, "Dates provided are not valid"]
    }

    // Compare the dates - return true if end date is after start date
    if (endDate >= startDate) {
        return [true, ""]
    }
    return [false, "start date must be less than or equal to end date!"]
};