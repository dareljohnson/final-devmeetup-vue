export default (value) => {
    const date = new Date(value)
    return date.toISOString().substring(0, 10)
}