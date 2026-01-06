import { useEffect } from 'react'
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    MenuItem,
    CircularProgress
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationSchema, type ReservationFormData } from '../../schemas/reservationSchema'
import type { Desk } from "../../../desks";

interface ReservationFormProps {
    title: string
    submitLabel: string
    initialData?: ReservationFormData
    desks: Desk[] | undefined
    isLoadingDesks: boolean
    isPending: boolean
    error: Error | null
    onSubmit: (data: ReservationFormData) => void
    onCancel: () => void
}

export function ReservationForm({
    title,
    submitLabel,
    initialData,
    desks,
    isLoadingDesks,
    isPending,
    error,
    onSubmit,
    onCancel
}: Readonly<ReservationFormProps>) {
    const { t } = useTranslation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            deskId: initialData?.deskId || '',
            reservationDate: initialData?.reservationDate
                ? new Date(initialData.reservationDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
        }
    })

    useEffect(() => {
        if (initialData) {
            reset({
                deskId: initialData.deskId,
                reservationDate: new Date(initialData.reservationDate).toISOString().split('T')[0]
            })
        }
    }, [initialData, reset])

    if (isLoadingDesks) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {title}
                </Typography>

                <form onSubmit={handleSubmit((data) => onSubmit(data))} noValidate>
                    <Stack spacing={3} sx={{ mt: 3 }}>
                        <TextField
                            select
                            label={t('reservation.selectDesk')}
                            {...register('deskId')}
                            error={!!errors.deskId}
                            helperText={errors.deskId?.message || t('reservation.chooseAvailableDesk')}
                            required
                            fullWidth
                        >
                            {desks?.map((desk) => (
                                <MenuItem key={desk.id} value={desk.id}>
                                    {desk.deskNumber} ({t('desk.floor')} {desk.floor})
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label={t('reservation.date')}
                            type="date"
                            {...register('reservationDate')}
                            error={!!errors.reservationDate}
                            helperText={errors.reservationDate?.message}
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: new Date().toISOString().split('T')[0]
                            }}
                        />

                        {error && (
                            <Typography color="error" variant="body2">
                                {error.message || t('common.error')}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isPending}
                                fullWidth
                            >
                                {isPending ? t('common.saving') : submitLabel}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={isPending}
                                fullWidth
                            >
                                {t('common.cancel')}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}