import {schema, Infer} from '@feathersjs/schema';

export const configurationSchema = schema({
  $id: 'FeathersConfiguration',
  type: 'object',
  additionalProperties: true,
  required: ['port', 'mongo'],
  properties: {
    port: {type: 'number'},
    mongo: {
      type: 'object',
      additionalProperties: false,
      required: ['uri'],
      properties: {
        uri: {type: 'string'},
      },
    },
  },
} as const);

export type Configuration = Infer<typeof configurationSchema>;
