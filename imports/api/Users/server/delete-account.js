/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import Games from '../../Games/Games';

let action;

const deleteUser = (userId) => {
  try {
    return Meteor.users.remove(userId);
  } catch (exception) {
    throw new Error(`[deleteAccount.deleteUser] ${exception.message}`);
  }
};

const deleteGames = (userId) => {
  try {
    return Games.remove({ owner: userId });
  } catch (exception) {
    throw new Error(`[deleteAccount.deleteGames] ${exception.message}`);
  }
};

const deleteAccount = ({ userId }, promise) => {
  try {
    action = promise;
    deleteGames(userId);
    deleteUser(userId);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};

export default options =>
  new Promise((resolve, reject) =>
    deleteAccount(options, { resolve, reject }));
