import { useNavigate, useParams } from '@tanstack/react-router'
import { reservationModule } from '../module'
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReservationForm } from "./forms/reservationForm";
import { desksModule } from "../../desks";

import { Box, CircularProgress } from "@mui/material";
import { useTranslation } from 'react-i18next';

export default function ReservationEditView() {
     const navigate = useNavigate()
     const { t } = useTranslation()
     const { id } = useParams({ from: '/protected/reservations/$id/edit' })
     const { queries } = reservationModule

     const { data: reservation, isLoading: isResLoading } = useQuery(queries.getById(id))


     const { data: desks, isLoading: isDesksLoading } = useQuery({
          ...desksModule.queries.getAll(),
          select: (data) => data.items || data
     })

     const { mutate, isPending, error } = useMutation({
          ...queries.update,
          onSuccess: async (result, variables, context) => {
               if (queries.update.onSuccess) {
                    await queries.update.onSuccess(result, variables, context)
               }
               navigate({ to: reservationModule.routes.view.to as any, params: { id } as any })
          }
     })

     if (isResLoading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>

     return (
          <ReservationForm
               title={t('reservation.editTitle')}
               submitLabel={t('reservation.updateReservation')}
               initialData={reservation}
               desks={desks}
               isLoadingDesks={isDesksLoading}
               isPending={isPending}
               error={error}
               onCancel={() => navigate({ to: reservationModule.routes.list.to })}
               onSubmit={(formData) => mutate({ id, data: { ...reservation, ...formData } })}
          />
     )
}