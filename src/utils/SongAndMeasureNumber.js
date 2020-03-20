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

const compare = (a, b) => {
    const [, number1, letter1] = a.match(pattern)
    const [, number2, letter2] = b.match(pattern)

    if (number1 !== number2) {
        return number1 - number2
    } else {
        return letter1 < letter2 ? -1 : 1
    }
}

export const songCompare = (s1, s2) => compare(s1.number, s2.number)

export const cueCompare = (c1, c2) => compare(c1.measure, c2.measure)
