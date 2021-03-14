import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();
const initialState = {
  isLoading: false,
  command: '',
  fileNames: [],
  outputFile: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case 'SET_COMMAND':
      return {
        ...state,
        command: action.command,
      };
    case 'SET_FILENAMES':
      return {
        ...state,
        fileNames: action.fileNames,
      };
    case 'SET_OUTPUTFILE':
      return {
        ...state,
        outputFile: action.outputFile,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
