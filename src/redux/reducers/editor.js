import { OPEN_EDITOR, CHANGE_EDITOR_PREFILL, CLOSE_EDITOR, LINK_UPDATED, LINK_UPDATE_HANDLED } from '../actions/editor';

const initialState = {
    editorOpen: false,
    linkPrefill: null,
    needToUpdate: false
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
        case LINK_UPDATED:
            return {
                ...state,
                needToUpdate: true
            }
        case LINK_UPDATE_HANDLED:
            return {
                ...state,
                needToUpdate: false
            }
        default:
            return state;
    }
}