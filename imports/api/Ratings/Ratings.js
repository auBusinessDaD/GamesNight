/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Ratings = new Mongo.Collection('Ratings');

Ratings.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Ratings.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

loanedItems = new SimpleSchema({
  loaner: {
    type: String,
    label: 'The person loaning this game',
  },
  loanee: {
    type: String,
    label: 'The person borrowing this game',
  },
});

basicRating = new SimpleSchema({
  user: {//need to make person only able to give one response
    type: String,
    label: 'The person',
    autoValue: function() {
			return this.userId;
		},
  },
  result: {
    type: String,
    label: 'Your Result',
    /*autoform: {
      options: [
        {label: "Yes", value: 1},
        {label: "No", value: 0}
      ]
    },*/
  },
});

bonusRating = new SimpleSchema({
  user: {//need to make person only able to give one response
    type: String,
    label: 'The person',
    autoValue: function() {
			return this.userId;
		},
  },
  result: {
    type: String,
    label: 'Your Result',
    /*autoform: {
      options: [
        {label: "Yes", value: 2},
        {label: "No", value: 0}
      ]
    },*/
  },
});

advancedRating = new SimpleSchema({
  user: {//need to make person only able to give one response
    type: String,
    label: 'The person',
    autoValue: function() {
			return this.userId;
		},
  },
  result: {
    type: String,
    label: 'Your Result',
    /*autoform: {
      options: [
        {label: "Even if a friend has it", value: 7},
        {label: "At RRP", value: 5},
        {label: "Only on special", value: 2},
        {label: "No", value: 0}
      ]
    },*/
  },
});

Ratings.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this game is published by.',
  },
  game: {
    type: String,//lookup to Games collection
    label: 'An extract of the game.',
  },
  wantToPlay: {
    type: Array,
    label: 'People who want to play this game',
    optional: true,
  },
  'wantToPlay.$': {
    type: basicRating,
  },
  havePlayed: {
    type: Array,
    label: 'Have you played this game',
    optional: true,
  },
  'havePlayed.$': {
    type: basicRating,
  },
  wouldPlayAgain: {
    type: Array,
    label: 'Would you play this game again',
    optional: true,
  },
  'wouldPlayAgain.$': {
    type: basicRating,
  },
  wouldRecommend: {
    type: Array,
    label: 'Would you recommend this game',
    optional: true,
  },
  'wouldRecommend.$': {
    type: bonusRating,
  },
  wouldBuy: {
    type: Array,
    label: 'Would you buy this game',
    optional: true,
  },
  'wouldBuy.$': {
    type: advancedRating,
  },
});

Ratings.attachSchema(Ratings.schema);

export default Ratings;
