import { useNavigate, useParams } from '@tanstack/react-router'
import { desksModule } from '../module'
import {useMutation, useSuspenseQuery} from "@tanstack/react-query"; // useMutation
import { DeskForm } from './forms/DeskForm'
import { useTranslation } from 'react-i18next'

export default function DeskEditView() {
    const navigate = useNavigate()
    const { id } = useParams({ from: '/protected/desks/$id/edit' }) //hook useParams takes value after $ sign and only id not userId - "$..."  
    const { t } = useTranslation()
    const { queries } = desksModule

    const { data: desk} = useSuspenseQuery(queries.getById(id))

    const { mutate, isPending, error: mutationError } = useMutation({
        ...queries.update,
        onSuccess: async (result, variables, context) => {
            if (queries.update.onSuccess) {
                queries.update.onSuccess(result, variables, context)
            }
            navigate({ 
                to: desksModule.routes.view.to as any, 
                params: { id } as any });
        }
    });

    return (
        <DeskForm
            title={t('desk.editTitle')}
            submitLabel={t('desk.updateDesk')}
            initialData={desk}
            isPending={isPending}
            error={mutationError instanceof Error ? mutationError : null}
            onSubmit={(data) => mutate({ id, data: { ...data, id, actions: desk.actions } })}
            onCancel={() => navigate({ to: desksModule.routes.list.to })}
        />
    )
}