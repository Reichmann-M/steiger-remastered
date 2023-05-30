module.exports.getFormattedSeconds = (normalSeconds) => {
    var sFormatted = ''
    if (normalSeconds >= 3600) {
        var hours = Math.round(normalSeconds / 3600)
        normalSeconds = normalSeconds - (hours * 3600)
        sFormatted = `${hours}h`
    }
    if (normalSeconds >= 60) {
        var minutes = Math.round(normalSeconds / 60)
        normalSeconds = normalSeconds - (minutes * 60)
        sFormatted = `${sFormatted} ${minutes}m`
    }
    if (normalSeconds > 0) {
        sFormatted = `${sFormatted} ${normalSeconds}s`
    }
    return sFormatted;
}