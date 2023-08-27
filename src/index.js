import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './store'; // Import your Redux store
import { library } from '@fortawesome/fontawesome-svg-core';
import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { UserProvider } from './userContext';
import App from './App';
library.add(faTrashAlt);

ReactDOM.render(
  <Provider store={store}>
    <UserProvider>
      <App />
    </UserProvider>
  </Provider>,
  document.getElementById('root')
);
