import { combineReducers } from '@reduxjs/toolkit';

import { InjectedReducersType } from '_types/injector_typings';

const createReducer = (injectedReducers: InjectedReducersType = {}) => {
    if (Object.keys(injectedReducers).length === 0) {
        return (state: any) => state;
    } else {
        return combineReducers({
            ...injectedReducers,
        });
    }
};

export default createReducer;
