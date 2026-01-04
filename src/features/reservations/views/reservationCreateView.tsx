import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { reservationModule } from '../module'
import { desksModule } from "../../desks";
import {
    Box,
    CircularProgress // SPINNER
} from '@mui/material'
import { ReservationForm } from "./forms/reservationForm";


export default function ReservationCreateView() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { queries } = reservationModule

    const { data: desks, isLoading: isDesksLoading } = useQuery({
        ...desksModule.queries.getAll(),
        select: (data) => data.items || data
    })

    const { mutate, isPending, error } = useMutation({
        ...queries.create,
        onSuccess: async (result, variables, context) => {
            if (queries.create.onSuccess) {
                await queries.create.onSuccess(result, variables, context)
            }
            navigate({ to: reservationModule.routes.view.fullPath as any, params: { id: result.id } as any })
        }
    })


    if (isDesksLoading) return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> // SPINNER

    return (
        <ReservationForm
            title={t('reservation.createTitle')}
            submitLabel={t('reservation.bookDesk')}
            desks={desks}
            isLoadingDesks={isDesksLoading}
            isPending={isPending}
            error={error}
            onCancel={() => navigate({ to: reservationModule.routes.list.to })}
            onSubmit={(data) => mutate(data)}
        />
    )
}