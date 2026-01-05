const ALLOW_VIEW = 1;
const ALLOW_CREATE = 2;
const ALLOW_EDIT = 2;
const ALLOW_DELETE = 4;

export function usePermissions(val = 0) {
    return {
        canView: (val & ALLOW_VIEW) === ALLOW_VIEW,
        canCreate: (val & ALLOW_CREATE) === ALLOW_CREATE,
        canEdit: (val & ALLOW_EDIT) === ALLOW_EDIT,
        canDelete: (val & ALLOW_DELETE) === ALLOW_DELETE,
    };
}
