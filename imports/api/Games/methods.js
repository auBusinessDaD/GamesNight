/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Games from './Games';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Array.prototype.arrayRemove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Meteor.methods({
  'games.findOne': function gamesFindOne(gameId) {
    check(gameId, Match.OneOf(String, undefined));

    try {
      return Games.findOne(gameId);
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.insert': function gamesInsert(gam) {
    //need to check if the user can actually create games or not
    check(gam, {
      title: String,
      description: String,
    });

    try {
      return Games.insert({ owner: this.userId });
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.update': function gamesUpdate(gam) {
    check(gam, {
      _id: String,
      title: String,
      description: String,
    });

    try {
      const gameId = gam._id;
      const gamToUpdate = Games.findOne(gameId, { fields: { owner: 1 } });

      if (gamToUpdate.owner === this.userId) {
        Games.update(gameId, { $set: gam });
        return gameId;
      }

      throw new Meteor.Error('403', 'Apologies - you eager beaver - but you\'re not allowed to edit this game.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.addFieldArray': function gamesAddField( gam ) {
    check(gam, {
      _id: String,
      field: String,
    });

    try {
      const gameId = gam._id;
      const gamToAddField = Games.findOne({ _id: gameId });
      let updatedArray = gamToAddField.owns.push( this.userId );//need to update "owns" with the gam.field value
      
      Games.update(gameId, { $set: { [gam.field]: this.userId } });//need to update "owns" with the gam.field value
      return gameId;

      throw new Meteor.Error('403', 'Apologies - we had some difficulties with your request.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.removeFieldArray': function gamesRemoveField( gam ) {
    check(gam, {
      _id: String,
      field: String,
    });

    try {
      const gameId = gam._id;
      const gamToRemoveField = Games.findOne({ _id: gameId });
      let updatedArray = gamToRemoveField.owns.arrayRemove( this.userId );//need to update "owns" with the gam.field value
      
      Games.update(gameId, { $set: { owns: updatedArray } });//need to update "owns" with the gam.field value
      return gameId;

      throw new Meteor.Error('403', 'Apologies - we had some difficulties with your request.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.remove': function gamesRemove(gameId) {
    check(gameId, String);

    try {
      const gamToRemove = Games.findOne(gameId, { fields: { owner: 1 } });

      if (gamToRemove.owner === this.userId) {
        return Games.remove(gameId);
      }

      throw new Meteor.Error('403', 'Apologies - you eager beaver - but you\'re not allowed to delete this game.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
});

rateLimit({
  methods: [
    'games.insert',
    'games.update',
    'games.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
