const isProduction = window
  ? window.location.host === "https://dylen-tool.acdh.oeaw.ac.at/" //TODO properties file env variable to detect production or not
  : process.env.NODE_ENV === "production";
//todo use real env variable

exports.log = (message) => {
  if (!isProduction) console.log(message);
};

exports.log = (message, ...args) => {
  if (!isProduction) console.log(message, ...args);
};

exports.error = (err) => {
  if (!isProduction) console.error(err);
};
