import React from 'react';
import PropTypes from 'prop-types';
import GameEditor from '../../../components/GameEditor/GameEditor';

const NewGame = ({ history }) => (
  <div className="NewGame">
    <h4 className="page-header">New Game</h4>
    <GameEditor history={history} />
  </div>
);

NewGame.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewGame;
