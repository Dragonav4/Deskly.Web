import {useNavigate} from '@tanstack/react-router'
import {useMutation} from '@tanstack/react-query'
import {desksModule} from '../module'
import {useTranslation} from 'react-i18next'
import {DeskForm} from './forms/DeskForm'

export default function DeskCreateView() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {queries} = desksModule

    const {mutate, isPending, error: mutationError} = useMutation({
        ...queries.create,
        onSuccess: async (result, variables, context) => {
            if (queries.create.onSuccess) {
                await queries.create.onSuccess(result, variables, context)
            }

            navigate({
                to: desksModule.routes.view.fullPath as any,
                params: {id: result.id} as any
            })
        }
    })

    return (
        <DeskForm
            title={t('desk.createTitle')}
            submitLabel={t('desk.createDesk')}
            isPending={isPending}
            error={mutationError instanceof Error ? mutationError : null}
            onSubmit={(data) => mutate(data)}
            onCancel={() => navigate({to: desksModule.routes.list.to})}
        />
    )
}