import { createStore, combineReducers } from 'redux';
import cartReducer from './reducers/cartReducer'; // Import the cartReducer you created

// Combine all reducers if you have more than one reducer
const rootReducer = combineReducers({
  cart: cartReducer,
  // Add other reducers here if needed
});

const store = createStore(rootReducer);

export default store;
