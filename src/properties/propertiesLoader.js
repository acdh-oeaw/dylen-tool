import properties from './properties.js';
import properties_dev from './properties_dev.js';
import properties_local from './properties_local.js';
import properties_local_sauto from './properties_local_sauto.js';

let environment = process.env.VUE_APP_ENVIRONMENT;

let props;

console.log('environment: ' + environment)
if (environment === 'dev') {
  props = properties_dev;
} else if (environment === 'prod') {
  props = properties;
} else if (environment === 'sauto') {
  props = properties_local_sauto;
} else {
  props = properties_local;
}

export default props;
