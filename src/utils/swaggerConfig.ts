import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersOptions } from '../server';

// Parse class-validator classes into JSON Schema:
const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: '#/components/schemas/',
});

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage();
const swaggerConfig = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    // securitySchemes: {
    //   basicAuth: {
    //     scheme: 'basic',
    //     type: 'http',
    //   },
    // },
  },
  info: {
    description: 'Created with ❤❤❤ @ `My Startup`',
    title: 'Markertplace Api',
    version: '0.1.0 Beta',
  },
});

export default swaggerConfig;
