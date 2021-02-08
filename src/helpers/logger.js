const isProduction = window
    ? window.location.host === 'https://dylen-tool.acdh.oeaw.ac.at/'
    : process.env.NODE_ENV === 'production'
//todo use real env variable

// exports.log = (message, ...args) => { if we want to append args
exports.log = (message) => {
    if (!isProduction) console.log(message)
}

exports.error = (err) => {
    if (!isProduction) console.error(err)
}