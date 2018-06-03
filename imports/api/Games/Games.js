/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Games = new Mongo.Collection('Games');

Games.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Games.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Games.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this game is published by.',
  },
  createdAt: {
    type: String,
    label: 'The date this document was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this document was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the game.',
  },
  description: {
    type: String,
    label: 'An extract of the game.',
  },
  owns: {//this is currently duplicating the Mine.js collection
    type: Array,
    label: 'People who own this game',
    optional: true,
  },
  'owns.$': {
    type: String,
  },
});

Games.attachSchema(Games.schema);

export default Games;