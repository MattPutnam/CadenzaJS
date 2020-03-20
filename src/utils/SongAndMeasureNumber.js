const pattern = /^(\d*)([A-Za-z]*)$/

export const validateSongOrMeasureNumber = number => {
    if (number.length === 0) {
        return 'Number must not be empty'
    }

    const match = number.match(pattern)
    if (!match) {
        return 'Number format not valid'
    }

    return false
}

export const compare = (a, b) => {
    const [, number1, letter1] = a
    const [, number2, letter2] = b

    if (number1 !== number2) {
        return number2 - number1
    } else {
        return letter1.localeCompare(letter2)
    }
}
