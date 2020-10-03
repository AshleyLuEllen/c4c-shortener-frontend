export const OPEN_EDITOR = "OPEN_EDITOR";
export const CLOSE_EDITOR = "CLOSE_EDITOR";
export const CHANGE_EDITOR_PREFILL = "CHANGE_EDITOR_PREFILL";
export const LINK_UPDATED = "LINK_UPDATED";
export const LINK_UPDATE_HANDLED = "LINK_UPDATE_HANDLED";

export function openEditor() {
    return {
        type: OPEN_EDITOR
    }
}

export function closeEditor() {
    return {
        type: CLOSE_EDITOR
    }
}

export function changeEditorPrefill(link) {
    return {
        type: CHANGE_EDITOR_PREFILL,
        link
    }
}

export function linkUpdated() {
    return {
        type: LINK_UPDATED
    }
}

export function updateHandled() {
    return {
        type: LINK_UPDATE_HANDLED
    }
}