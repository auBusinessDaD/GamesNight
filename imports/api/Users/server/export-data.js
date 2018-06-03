/* eslint-disable consistent-return */

import JSZip from 'jszip';
import Games from '../../Games/Games';

let action;

const generateZip = (zip) => {
  try {
    zip.generateAsync({ type: 'base64' })
      .then(content => action.resolve(content));
  } catch (exception) {
    throw new Error(`[exportData.generateZip] ${exception.message}`);
  }
};

const addGamesToZip = (games, zip) => {
  try {
    games.forEach((game) => {
      zip.file(`${game.title}.txt`, `${game.title}\n\n${game.body}`);
    });
  } catch (exception) {
    throw new Error(`[exportData.addGamesToZip] ${exception.message}`);
  }
};

const getGames = (userId) => {
  try {
    return Games.find({ owner: userId }).fetch();
  } catch (exception) {
    throw new Error(`[exportData.getGames] ${exception.message}`);
  }
};

const exportData = ({ userId }, promise) => {
  try {
    action = promise;
    const zip = new JSZip();
    const games = getGames(userId);
    addGamesToZip(games, zip);
    generateZip(zip);
  } catch (exception) {
    action.reject(exception.message);
  }
};

export default options =>
  new Promise((resolve, reject) =>
    exportData(options, { resolve, reject }));
