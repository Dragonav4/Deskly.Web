import { useNavigate, useParams } from '@tanstack/react-router'
import { desksModule } from '../module'
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeskForm } from './forms/DeskForm'
import { Box, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function DeskEditView() {
    const navigate = useNavigate()
    const { id } = useParams({ from: '/protected/desks/$id/edit' })
    const { t } = useTranslation()
    const { queries } = desksModule

    const { data: desk, isLoading } = useQuery(queries.getById(id))

    const { mutate, isPending, error: mutationError } = useMutation({
        ...queries.update,
        onSuccess: async (result, variables, context) => {
            if (queries.update.onSuccess) {
                await queries.update.onSuccess(result, variables, context)
            }
            navigate({ to: desksModule.routes.view.to as any, params: { id } as any });
        }
    });

    if (isLoading) {
        return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
    }

    return (
        <DeskForm
            title={t('desk.editTitle')}
            submitLabel={t('desk.updateDesk')}
            initialData={desk}
            isPending={isPending}
            error={mutationError instanceof Error ? mutationError : null}
            onSubmit={(data) => mutate({ id, data: { ...data, id, actions: desk!.actions } })}
            onCancel={() => navigate({ to: desksModule.routes.list.to })}
        />
    )
}