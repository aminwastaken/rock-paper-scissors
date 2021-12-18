import {createContext} from 'react';

const Context = createContext({
  user: {username: '', token: ''},
  setUser: () => {},
});

export default Context;
