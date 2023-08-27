import { combineReducers } from 'redux';
import cartReducer from './cartReducer';
// Import other reducers here if you have them

const rootReducer = combineReducers({
  cart: cartReducer,
  // Add other slices of state and their corresponding reducers here
});

export default rootReducer;