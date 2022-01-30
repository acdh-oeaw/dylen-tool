const isProduction = window
  ? window.location.host === 'https://dylen-tool.acdh.oeaw.ac.at/'
  : process.env.VUE_APP_ENVIRONMENT === 'prod';

exports.log = (message) => {
  if (!isProduction) console.log(message);
};

exports.log = (message, ...args) => {
  if (!isProduction) console.log(message, ...args);
};

exports.error = (err) => {
  if (!isProduction) console.error(err);
};
