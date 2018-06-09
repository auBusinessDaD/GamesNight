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
    autoValue() {
      if (this.isInsert) return this.userId;
    },
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
  altTitle: {
    type: String,
    label: 'Alternate names for this game.',
    optional: true,
  },
  description: {
    type: String,
    label: 'An extract of the game.',
  },
  wishlist: {
    type: Array,
    label: 'People who want this game.',
    optional: true,
  },
  'wishlist.$': {
    type: String,
  },
  owns: {
    type: Array,
    label: 'People who own this game.',
    optional: true,
  },
  'owns.$': {
    type: String,
  },
  rrp: {
    type: String,
    label: 'Recomended Retail Price for this game.',
    optional: true,
  },
  edition: {
    type: String,
    label: 'The edition number of this game.',
    optional: true,
  },
  pubYear: {
    type: String,
    label: 'The year this game/edition was published.',
    optional: true,
  },
  players: {
    type: String,
    label: 'The number of players that play this game.',
    optional: true,
  },
  playTime: {
    type: String,
    label: 'How long is the advised playing time for this game, in minutes.',
    optional: true,
  },
  ageRange: {
    type: String,
    label: 'What is the recomended age range for this game.',
    optional: true,
  },
  designers: {
    type: String,
    label: 'Who were the designers of this game.',
    optional: true,
  },
  artist: {
    type: String,
    label: 'Who were the artists on this game.',
    optional: true,
  },
  publishers: {
    type: String,
    label: 'Who were the publishers of this game/edition.',
    optional: true,
  },
  categories: {
    type: Array,
    label: 'What categories does this game fit into.',
    optional: true,
  },
  'categories.$': {
    type: String,
  },
  gameMech: {
    type: Array,
    label: 'What game mechanics does this game utilise.',
    optional: true,
  },
  'gameMech.$': {
    type: String,
  },
  type: {
    type: Array,
    label: 'What type of game is this.',
    optional: true,
  },
  'type.$': {
    type: String,
  },
  kidFriendly: {
    type: Boolean,
    label: 'Would kids be able to play this game.',
    optional: true,
  },
  expansion: {
    type: Boolean,
    label: 'Is this an expansion of another game.',
    optional: true,
  },
  standalone: {
    type: Boolean,
    label: 'If this is an expansion, does it require the base game.',
    optional: true,
  },
  expAvail: {
    type: Boolean,
    label: 'Is there an expansion available for this game.',
    optional: true,
  },
});

Games.attachSchema(Games.schema);

export default Games;
