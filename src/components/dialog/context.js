import  {createContext} from 'react';


export const ActionBoxContext = createContext({
    open: (data) => {
    },
    close: (index) => {
    },
    cancelClose: (index) => {

    },
    timerClose: (index, timer) => {

    },
});
ActionBoxContext.displayName = 'ActionBoxContext';
