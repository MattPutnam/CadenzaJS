export const findId = objects => {
    const ids = objects.map(obj => obj.id)
    let candidate = 0
    while (ids.includes(candidate)) {
        candidate++
    }
    return candidate
}