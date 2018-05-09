import { combineReducers } from 'redux';
import {
  REQUEST_SESSION,
  RECEIVE_SESSION,
} from '../actions';

import diva from '../diva-react/reducers/diva-reducer';

function user(
  state = {
    isFetching: false,
    sessionId: '',
    attributes: {},
  },
  action,
) {
  switch (action.type) {
    case REQUEST_SESSION:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_SESSION:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        sessionId: action.sessionId,
        attributes: action.attributes,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user,
  diva,
});

export default rootReducer;
