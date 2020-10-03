export const OPEN_EDITOR = "OPEN_EDITOR";
export const CLOSE_EDITOR = "CLOSE_EDITOR";
export const CHANGE_EDITOR_PREFILL = "CHANGE_EDITOR_PREFILL";

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
