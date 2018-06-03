import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Games from '../../../../api/Games/Games';
import GameEditor from '../../../components/GameEditor/GameEditor';
import NotFound from '../../NotFound/NotFound';

const EditGame = ({ gam, history }) => (gam ? (
  <div className="EditGame">
    <h4 className="page-header">{`Editing "${gam.title}"`}</h4>
    <GameEditor gam={gam} history={history} />
  </div>
) : <NotFound />);

EditGame.defaultProps = {
  gam: null,
};

EditGame.propTypes = {
  gam: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const gameId = match.params._id;
  const subscription = Meteor.subscribe('games.edit', gameId);

  return {
    loading: !subscription.ready(),
    gam: Games.findOne(gameId),
  };
})(EditGame);
