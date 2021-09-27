import properties from './properties.js';
import properties_dev from './properties_dev.js';
import properties_local from './properties_local.js';

let environment = process.env.VUE_APP_ENVIRONMENT;

let props;

if (environment === 'dev') {
  props = properties_dev;
} else if (environment === 'prod') {
  props = properties;
} else {
  props = properties_local;
}

export default props;
