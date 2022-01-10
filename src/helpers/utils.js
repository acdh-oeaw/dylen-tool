export function roundToMaxDigit(number, maxDigits) {
    return maxDigits > 10
        ? number
        : Math.round(
        (number + Number.EPSILON) *
        Math.pow(10, maxDigits)
    ) / Math.pow(10, maxDigits);
}