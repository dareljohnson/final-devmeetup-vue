export default (value) => {
    const date = new Date(value)
    return date.toLocaleString(['en-US'],{ hour:'2-digit', minute:'2-digit'})
}