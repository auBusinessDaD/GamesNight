import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import GamesCollection from '../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import BlankState from '../../components/BlankState/BlankState';
import SearchInput from '../../components/SearchInput/SearchInput';

const StyledGames = styled.div`
  table tbody tr td {
    vertical-align: middle;
  }
  
  .clickableText {
    cursor: pointer;
  }
  
  .sortableColumn {
    cursor: alias;
  }
  
  #modalPopup {
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background: rgba(0, 0, 0, 0.7);
	  justify-content: center;
	  align-items: center;
	  display: none;
	}
	#modalPopup .modal {
	  width: 450px;
	  display: block;
	  box-shadow: 0px 23px 30px -20px rgba(0, 0, 0, 0.4);
	}
	#modalPopup .modal .title {
	  background: #778797;
	  color: white;
	  border-radius: 4px 0px 0px 0px;
	  text-align: center;
	  line-height: 48px;
	  font-weight: 700;
	  width: 80%;
	  float: left;
	}
	#modalPopup .modal .closeModal {
	  background: #C70000;
	  color: white;
	  border-radius: 0px 4px 0px 0px;
	  text-align: center;
	  line-height: 48px;
	  font-weight: 700;
	  width: 20%;
	  float: left;
	  cursor: pointer;
	}
	#modalPopup .modal .body {
	  clear: both;
	  background: white;
	  line-height: 20px;
	  display: flex;
	  align-items: stretch;
	}
	#modalPopup .modal .body .content {
	  padding: 30px;
	}
	#modalPopup .modal .body .content select {
	  display: block;
	  width: 390px;
	}
	#modalPopup .modal .submitUser {
	  background: #ababab;
	  color: white;
	  border-radius: 0px 0px 4px 4px;
	  text-align: center;
	  line-height: 48px;
	  font-weight: 700;
	}
	#modalPopup .modal .submitUser.modalSending {
	  background: #004499;
	  cursor: pointer;
	}
	#modalPopup.showModal {
	  display: flex;
	  -webkit-animation: fadeIn 300ms ease-in-out forwards;
			  animation: fadeIn 300ms ease-in-out forwards;
	}
	#modalPopup.showModal .modal {
	  -webkit-animation: modalAnim 500ms ease-in-out forwards;
			  animation: modalAnim 500ms ease-in-out forwards;
	}
	#modalPopup.modalSending {
	  -webkit-animation: fadeOut 300ms ease-in-out forwards;
			  animation: fadeOut 300ms ease-in-out forwards;
	}
	#modalPopup.modalSending .modal {
	  -webkit-animation: modalSend 500ms ease-in-out forwards;
			  animation: modalSend 500ms ease-in-out forwards;
	}

	@-webkit-keyframes fadeIn {
	  0% {
		background-color: rgba(0, 0, 0, 0);
	  }
	  100% {
		background-color: rgba(0, 0, 0, 0.3);
	  }
	}

	@keyframes fadeIn {
	  0% {
		background-color: rgba(0, 0, 0, 0);
	  }
	  100% {
		background-color: rgba(0, 0, 0, 0.3);
	  }
	}
	@-webkit-keyframes fadeOut {
	  0% {
		background-color: rgba(0, 0, 0, 0.3);
	  }
	  100% {
		background-color: rgba(0, 0, 0, 0);
	  }
	}
	@keyframes fadeOut {
	  0% {
		background-color: rgba(0, 0, 0, 0.3);
	  }
	  100% {
		background-color: rgba(0, 0, 0, 0);
	  }
	}
	@-webkit-keyframes modalAnim {
	  0% {
		-webkit-transform: translateX(-200%) rotate(-90deg);
				transform: translateX(-200%) rotate(-90deg);
		opacity: 0;
	  }
	  60% {
		-webkit-transform: translateX(8%) rotate(8deg);
				transform: translateX(8%) rotate(8deg);
	  }
	  80% {
		-webkit-transform: translateX(-4%) rotate(-4deg);
				transform: translateX(-4%) rotate(-4deg);
	  }
	  100% {
		-webkit-transform: translateX(0%);
				transform: translateX(0%);
	  }
	}
	@keyframes modalAnim {
	  0% {
		-webkit-transform: translateX(-200%) rotate(-90deg);
				transform: translateX(-200%) rotate(-90deg);
		opacity: 0;
	  }
	  60% {
		-webkit-transform: translateX(8%) rotate(8deg);
				transform: translateX(8%) rotate(8deg);
	  }
	  80% {
		-webkit-transform: translateX(-4%) rotate(-4deg);
				transform: translateX(-4%) rotate(-4deg);
	  }
	  100% {
		-webkit-transform: translateX(0%);
				transform: translateX(0%);
	  }
	}
	@-webkit-keyframes modalSend {
	  0% {
		-webkit-transform: translateX(0%);
				transform: translateX(0%);
	  }
	  70% {
		-webkit-transform: translateY(-75%) scale(0.3, 0.3);
				transform: translateY(-75%) scale(0.3, 0.3);
	  }
	  100% {
		-webkit-transform: translateY(-200%) scale(0.3, 0.3) rotate(50deg);
				transform: translateY(-200%) scale(0.3, 0.3) rotate(50deg);
	  }
	}
	@keyframes modalSend {
	  0% {
		-webkit-transform: translateX(0%);
				transform: translateX(0%);
	  }
	  70% {
		-webkit-transform: translateY(-75%) scale(0.3, 0.3);
				transform: translateY(-75%) scale(0.3, 0.3);
	  }
	  100% {
		-webkit-transform: translateY(-200%) scale(0.3, 0.3) rotate(50deg);
				transform: translateY(-200%) scale(0.3, 0.3) rotate(50deg);
	  }
	}
`;

const showModal = () => {
  $("#modalPopup").addClass( "showModal" );
};

const closeModal = () => {
  $("#modalPopup").removeClass( "showModal" );
};

const handleAdd = (gameId, gameField) => {
  let addItem = { _id: gameId, field: gameField };
  Meteor.call('games.addFieldArray', addItem, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Your wish, our command! So it be done!', 'success');
    }
  });
};

const handleRemove = (gameId, gameField) => {
  let remItem = { _id: gameId, field: gameField };
  
  if (confirm('Are you sure? Like, REALLY sure!?!')) {
    Meteor.call('games.removeFieldArray', remItem, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Your wish our command! So it be done!', 'success');
      }
    });
  }
};

const sortTable = (tableHeader, sortType) => {
  let thisTable, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  thisTable = document.getElementById("gameTable");
  switching = true;
  
  dir = "asc";
  
  while (switching) {
    switching = false;
    rows = thisTable.rows;
    
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      
      x = rows[i].getElementsByTagName("TD")[tableHeader];
      y = rows[i + 1].getElementsByTagName("TD")[tableHeader];
      
      if (dir == "asc") {
        if (sortType == "text") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (sortType == "number") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        if (sortType == "text") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (sortType == "number") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
    };
    
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  };
};

const Games = ({
  loading, games, match, history,
}) => (!loading ? (
  <StyledGames>
    <div className="page-header clearfix">
      <h4 className="pull-left">My Games</h4>
      <SearchInput />
    </div>
    {games.length ?
      <Table id="gameTable" responsive>
        <thead>
          <tr>
            <th className="sortableColumn" onClick={() => sortTable(0, "text")}>Title</th>
            <th className="sortableColumn" onClick={() => sortTable(1, "text")}>Location</th>
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, playGame
          }) => (
            <tr key={_id}>
              <td>
                <span className="clickableText" onClick={() => history.push(`/games/${_id}`)}>{title}</span>
              </td>
              <td>On Shelf OR Loaned to XXX</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => showModal()}
                  block
                >
                  **Loan To**
                </Button>
              </td>
              <td>
                { playGame ?
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id, "wantPlay")}
                    block
                  >
                    Satiated Desire
                  </Button>
                  : <Button
                    bsStyle="primary"
                    onClick={() => handleAdd(_id, "wantPlay")}
                    block
                  >
                    Itching To Play
                </Button> }
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id, "owns")}
                  block
                >
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="You're plum out of games, friend!"
        subtitle="Add some games to your collection below."
        action={{
          style: 'success',
          onClick: () => history.push('/games'),
          label: 'Find Some Games Here',
        }}
      />}
    <div id="modalPopup">
        <div class="modal">
          <div class="title">Select a user to loan to...</div>
          <div class="closeModal" onClick={() => closeModal()}>X</div>
          <div class="body">
          <div class="content">
             <select class="pplSelect">
             <option disabled selected value> -- select a user -- </option>
            <option value="asdfadfgfsh">Daniel Lewis</option>
            <option value="dmndfjtrnsr">Frank Derptstrom</option>
            <option value="ngsffgnsfjf">Prince Hairy</option>
            <option value="geerveqrryu">Knighting Gaile</option>
            </select>
          </div>
          </div>
          <div class="submitUser">Loan to <span id="selectedUser">...</span></div>
        </div>
      </div>
  </StyledGames>
) : <Loading />);

Games.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('games');
  const gamesArray = GamesCollection.find({ owns: Meteor.userId() }).fetch();
  
  const gamesArrayMap = gamesArray.map( (game) => {
    const gamePlay = game ? game.wantPlay.indexOf( Meteor.userId() ) > -1 : false;
    
    return {
      ...game,
      playGame: gamePlay ? true : false,
    };
  } );
  
  return {
    loading: !subscription.ready(),
    games: gamesArrayMap,
  };
})(Games);
