import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import thunk from 'redux-thunk'
import vocabularyReducer from './vocabulary/reducers'
import gameReducer from './game/reducers'

const composeEnhancers = compose

const rootReducer = combineReducers({
    vocabularyModule: vocabularyReducer,
    gameModule: gameReducer
})

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))