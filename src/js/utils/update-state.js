import update from 'immutability-helper';

function updateState(obj, def) {
  obj.setState(update(obj.state, def));
}

export default updateState;