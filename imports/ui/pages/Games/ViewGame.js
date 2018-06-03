import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Games from '../../../api/Games/Games';
import SEO from '../../components/SEO/SEO';
import NotFound from '../NotFound/NotFound';

const handleRemove = (gameId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('games.remove', gameId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game deleted!', 'success');
        history.push('/games');
      }
    });
  }
};

const renderGame = (gam, match, history) => (gam ? (
  <div className="ViewGame">
    <SEO
      title={gam.title}
      description={gam.description}
      url={`games/${gam._id}`}
      contentType="article"
      published={gam.createdAt}
      updated={gam.updatedAt}
      twitter="clvrbgl"
    />
    <div className="page-header clearfix">
      <h4 className="pull-left">{ gam && gam.title }</h4>
      {Meteor.isClient && Meteor.userId() ? (
        ''/*<ButtonToolbar className="pull-right">
          <ButtonGroup bsSize="small">
            <Button onClick={() => history.push(`${match.url}/manage/edit`)}>Edit</Button>
            <Button onClick={() => handleRemove(gam._id, history)} className="text-danger">
              Delete
            </Button>
          </ButtonGroup>
        </ButtonToolbar>*/
      ) : ''}
    </div>
    { gam && gam.description }
  </div>
) : <NotFound />);

const ViewGame = ({ gam, match, history }) => (renderGame(gam, match, history));

ViewGame.defaultProps = {
  gam: null,
};

ViewGame.propTypes = {
  gam: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  connect(state => ({ ...state })),
  withTracker(({ match }) => {
    const gameId = match.params._id;
    if (Meteor.isClient) Meteor.subscribe('games.view', gameId);

    return {
      gam: Games.findOne(gameId),
    };
  }),
)(ViewGame);
