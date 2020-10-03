import { combineReducers } from 'redux';
import { reducer as authReducer } from './auth';
import { reducer as editorReducer } from './editor';

export default combineReducers({
    // Add your reducers here
    auth: authReducer,
    editor: editorReducer
});
