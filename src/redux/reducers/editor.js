import { OPEN_EDITOR, CHANGE_EDITOR_PREFILL, CLOSE_EDITOR } from '../actions/editor';

const initialState = {
    editorOpen: false,
    linkPrefill: null
}

export function reducer(state = initialState, action) {
    switch(action.type) {
        case OPEN_EDITOR:
            return {
                ...state,
                editorOpen: true
            }    
        case CLOSE_EDITOR:
            return {
                ...state,
                editorOpen: false,
                linkPrefill: null
            }    
        case CHANGE_EDITOR_PREFILL:
            return {
                ...state,
                linkPrefill: action.link 
            }
        default:
            return state;
    }
}