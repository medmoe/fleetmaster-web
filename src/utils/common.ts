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
