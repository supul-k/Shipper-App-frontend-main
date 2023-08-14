import { combineReducers } from "redux";
import snackBarReducer from './snackBarReducer'
import modalReducer from './modalReducer'

export default combineReducers({
    snackBarReducer,
    modalReducer,
})