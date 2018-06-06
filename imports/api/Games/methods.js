/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Games from './Games';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

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
      return Games.insert({ owner: this.userId, owns: this.userId, ...gam });//this is auto adding the owner to owning this games
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
        return gameId; // Return _id so we can redirect to game after update.
      }

      throw new Meteor.Error('403', 'Apologies - you eager beaver - but you\'re not allowed to edit this game.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.addField': function gamesAddField( gam ) {
    check(gam, {
      _id: String,
    });

    try {
      const gameId = gam._id;
      const gamToUpdate = Games.findOne(gameId, { fields: { owns: 1 } });

      if (gamToUpdate.owns !== this.userId) {//should this be not equal to !== or should it be does not contain?
        Games.update(gameId, { $set: { owns: this.userId } });//don't want to set gam to new value, just add the person to the owns field to the array - not replace previous
        return gameId; // Return _id so we can redirect to game after update.
      }

      throw new Meteor.Error('403', 'Apologies - we had some difficulties with your request.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.removeField': function gamesRemoveField( gam ) {
    check(gam, {
      _id: String,
    });

    try {
      const gameId = gam._id;
      const gamToUpdate = Games.findOne(gameId, { fields: { owns: 1 } });

      if (gamToUpdate.ownes == this.userId) {//should this be equal to == or should it be contains?
        Games.update(gameId, { $set: { owns: this.userId } });//don't want to set gam to new value, just remove the person from the owns field
        return gameId; // Return _id so we can redirect to game after update.
      }

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
