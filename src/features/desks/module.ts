import { createCrudModule } from '../../shared/lib/crud/createCrudModule'
import { desksApi } from './api/api'
import {
    DesksListView,
    DeskView,
    DeskCreateView,
    DeskEditView,
} from './views'

export const desksModule = createCrudModule({
    name: 'desks',
    api: desksApi,
    views: {
        List: DesksListView,
        View: DeskView,
        Create: DeskCreateView,
        Edit: DeskEditView,
    },
})
