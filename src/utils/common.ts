export const isPositiveInteger = (str: string): boolean => {
    if (!str) {
        return false
    }
    const pattern = new RegExp('^[0-9]\\d*$')
    return pattern.test(str)
}