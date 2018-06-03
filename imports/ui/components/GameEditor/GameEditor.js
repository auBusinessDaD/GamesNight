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
    };

    if (existingGame) gam._id = existingGame;

    Meteor.call(methodToCall, gam, (error, gameId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingGame ? 'Game updated!' : 'Game added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/games/${gameId}`);
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
            placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
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
  gam: { title: '', description: '' },
};

GameEditor.propTypes = {
  gam: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default GameEditor;
