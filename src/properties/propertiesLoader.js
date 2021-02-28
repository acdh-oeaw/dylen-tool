import * as properties from "./properties.json";
import * as properties_dev from "./properties_dev.json";
import * as properties_staging from "./properties_staging.json";

//TODO get this from env variable
export const getProperties = (env) => {
  if (env === "dev") {
    return properties_dev;
  } else if (env === "staging") {
    return properties_staging;
  } else {
    return properties;
  }
};
