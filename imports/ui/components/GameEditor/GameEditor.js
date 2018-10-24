/* eslint-disable max-len, no-return-assign */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class GameEditor extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        description: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        description: {
          required: 'This thneeds a body, please.',
        },
      },
      submitHandler() { component.handleSubmit(component.form); },
    });
  }

  handleSubmit(form) {
    const { history } = this.props;
    const existingGame = this.props.gam && this.props.gam._id;
    const methodToCall = existingGame ? 'games.update' : 'games.insert';
    const gam = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      altTitle: form.altTitle.value.trim(),
      rrp: form.rrp.value.trim(),
      edition: form.edition.value.trim(),
      pubYear: form.pubYear.value.trim(),
      players: form.players.value.trim(),
      optimalPlayers: form.players.value.trim(),
      playTime: form.playTime.value.trim(),
      ageRange: form.ageRange.value.trim(),
      designers: form.designers.value.trim(),
      artists: form.artists.value.trim(),
      publisher: form.publisher.value.trim(),
      kidFriendly: (form.kidFriendly.checked == 'true'),
      expAvail: (form.expAvail.checked == 'true'),
      expansion: (form.expansion.checked == 'true'),
      standalone: (form.standalone.checked == 'true'),
    };

    if (existingGame) gam._id = existingGame;

    Meteor.call(methodToCall, gam, (error, gameId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingGame ? 'Game updated!' : 'Game added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/game/manage/${gameId}`);
      }
    });
  }

  render() {
    const { gam } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="title"
            defaultValue={gam && gam.title}
            placeholder="Oh, The Games We Will Play!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <textarea
            className="form-control"
            name="description"
            defaultValue={gam && gam.description}
            placeholder="Show the world how great this game is with your eloquent articulation!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Alternate Titles</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="altTitle"
            defaultValue={gam && gam.altTitle}
            placeholder="Oh, the confusion we could have!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Recomended Retail Price</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="rrp"
            defaultValue={gam && gam.rrp}
            placeholder="Oh, the money they'll pay!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Edition</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="edition"
            defaultValue={gam && gam.edition}
            placeholder="The edition number of this game!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Year of Publishing</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="pubYear"
            defaultValue={gam && gam.pubYear}
            placeholder="The year in which this game/edition was published!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Number of Players</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="players"
            defaultValue={gam && gam.players}
            placeholder="The number of players that can play this game!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Optimal Number of Players</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="optimalPlayers"
            defaultValue={gam && gam.optimalPlayers}
            placeholder="The optimal number of players when playing this game."
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Playing Time</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="playTime"
            defaultValue={gam && gam.playTime}
            placeholder="The advised time to play this game!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Age Range</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="ageRange"
            defaultValue={gam && gam.ageRange}
            placeholder="The recomended age for players!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Designers</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="designers"
            defaultValue={gam && gam.designers}
            placeholder="Who were the designers on this game!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Artists</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="artists"
            defaultValue={gam && gam.artists}
            placeholder="Who were the artists on this game!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Publisher</ControlLabel>
          <input
            type="text"
            className="form-control"
            name="publisher"
            defaultValue={gam && gam.publisher}
            placeholder="Who was the publisher of this game/edition!"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Kid Friendly</ControlLabel>
          <input
            type="checkbox"
            className="form-control"
            name="kidFriendly"
            defaultValue={gam && gam.kidFriendly}
            placeholder="Is this game child friendly?"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Expansion Available</ControlLabel>
          <input
            type="checkbox"
            className="form-control"
            name="expAvail"
            defaultValue={gam && gam.expAvail}
            placeholder="Is there an expansion available?"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Expansion</ControlLabel>
          <input
            type="checkbox"
            className="form-control"
            name="expansion"
            defaultValue={gam && gam.expansion}
            placeholder="Is this game an expansion of an existing game?"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Standalone Expansion</ControlLabel>
          <input
            type="checkbox"
            className="form-control"
            name="standalone"
            defaultValue={gam && gam.standalone}
            placeholder="Is this game playable by itself? or does it need the base game"
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {gam && gam._id ? 'Save Changes' : 'Add Game'}
        </Button>
      </form>
    );
  }
}

GameEditor.defaultProps = {
  gam: { title: '', description: '', wishlist: '', owns: '', altTitle: '', rrp: '', edition: '', pubYear: '', players: '', optimalPlayers: '', playTime: '', ageRange: '', designers: '', artists: '', publisher: '', kidFriendly: '', expAvail: '', expansion: '', standalone: '' },
};

GameEditor.propTypes = {
  gam: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default GameEditor;
