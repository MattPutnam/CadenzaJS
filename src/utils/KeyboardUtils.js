import _ from 'lodash'


export const WHITE_HEIGHT = 81 // height of white key
export const WHITE_WIDTH = 14  // width of white key
export const BLACK_HEIGHT = 50 // height of black key
export const BLACK_WIDTH = 11  // width of black key

const CUT_HALF = WHITE_WIDTH / 2 // cut-in of C# into C, half the width of a white key
const CUT_NEGHALF = BLACK_WIDTH - CUT_HALF // cut-in of C# into D, the remaining part of the black key
const CUT_MIDHALF = BLACK_WIDTH / 2 // cut-in of G# into G or A, half the width of a black key

const LEFT_MARGINS = [
    0,
        CUT_HALF,
    CUT_NEGHALF,
        CUT_NEGHALF,
    CUT_HALF,
    0,
        CUT_HALF,
    CUT_NEGHALF,
        CUT_MIDHALF,
    CUT_MIDHALF,
        CUT_NEGHALF,
    CUT_HALF
]

export const leftMargin = note => LEFT_MARGINS[note % 12]

const BLACK_NOTES_MOD = new Set([1, 3, 6, 8, 10])
export const isWhite = note => !isBlack(note)
export const isBlack = note => BLACK_NOTES_MOD.has(note % 12)

export const getDimensions = ([keyboardLow, keyboardHigh], { lowNote, highNote }) => {
    let left = 0
    if (lowNote && lowNote > keyboardLow) {
        left = _.range(keyboardLow, lowNote).filter(isWhite).length * WHITE_WIDTH - (isBlack(lowNote) ? leftMargin(lowNote) : 0)
    }

    const realLow = lowNote ? Math.max(keyboardLow, lowNote) : keyboardLow
    const realHigh = highNote ? Math.min(keyboardHigh, highNote) : keyboardHigh
    const width = _.range(realLow, realHigh+1).filter(isWhite).length * WHITE_WIDTH +
        (isBlack(realLow) ? leftMargin(realLow) : 0) + (isBlack(realHigh) ? leftMargin(realHigh+1) : 0) + 1

    return { left, width }
}


export const groupIntoRows = patchUsages => {
    const [fulls, partials] = _.partition(patchUsages, patchUsage => !patchUsage.lowNote && !patchUsage.highNote)
    const rows = fulls.map(full => [full])

    partials.forEach(patchUsage => {
        if (!patchUsage.highNote) {
            patchUsage.highNote = Infinity
        }
        if (!patchUsage.lowNote) {
            patchUsage.lowNote = -Infinity
        }
    })
    const sorted = _.sortBy(partials, 'highNote')

    const filter = head => candidate => candidate.lowNote > head.highNote

    while (!_.isEmpty(sorted)) {
        const accumulation = []
        let candidates = _.clone(sorted)
        let head = sorted.shift()
        accumulation.push(head)
        candidates = _.filter(candidates, filter(head))

        while (!_.isEmpty(candidates)) {
            head = candidates.shift()
            _.remove(sorted, head)
            accumulation.push(head)
            candidates = _.filter(candidates, filter(head))
        }

        rows.push(accumulation)
    }

    rows.forEach(row => {
        row.forEach(patchUsage => {
            if (patchUsage.highNote === Infinity) {
                delete patchUsage.highNote
            }
            if (patchUsage.lowNote === -Infinity) {
                delete patchUsage.lowNote
            }
        })
    })

    return rows
}
