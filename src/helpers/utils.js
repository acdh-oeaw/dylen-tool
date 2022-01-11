export function roundToMaxDigit(number, maxDigits) {
    let roundedNumber = Math.round(
        (number + Number.EPSILON) *
        Math.pow(10, maxDigits)
    ) / Math.pow(10, maxDigits);

    return maxDigits > 10
        ? number
        : roundedNumber == 0 && number != 0 ? number.toExponential(2) : roundedNumber;
}