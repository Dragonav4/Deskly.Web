import { Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Box, Typography, Stack, Button, Container, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { reservationModule } from '../module'
import { DeleteEntityButton } from "../../../shared/components/DeleteButton";
import { useAuthStore } from "../../auth/store/authStore";
import { useTranslation } from 'react-i18next'
import { usePermissions } from '../../../shared/hooks/usePermissions'

export default function ReservationView() {
    const { t } = useTranslation()
    const { id } = reservationModule.routes.view.useParams()
    const { data: reservation } = useSuspenseQuery(reservationModule.queries.getById(id))
    const isAuth = useAuthStore(s => !!s.user)

    const { canEdit, canDelete } = usePermissions(reservation?.actions)

    const formattedDate = new Date(reservation.reservationDate).toLocaleDateString()
    const navigate = useNavigate()

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    {t('reservation.title')}
                </Typography>

                <Box sx={{ ml: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to={reservationModule.routes.list.to}
                        startIcon={<ArrowBackIcon />}
                        variant="text"
                    >
                        {t('common.back')}
                    </Button>

                    {isAuth && canEdit && (
                        <Button
                            component={Link}
                            to={reservationModule.routes.edit.to}
                            params={{ id: reservation.id }}
                            variant="outlined"
                        >
                            {t('common.edit')}
                        </Button>
                    )}
                    {isAuth && canDelete && (
                        <DeleteEntityButton
                            id={reservation.id}
                            title={`${t('reservation.title').toLowerCase()} ${reservation.id}`}
                            mutation={reservationModule.queries.delete}
                            invalidateKey={[reservationModule.id]}
                            onDeleted={() => navigate({ to: reservationModule.routes.list.to })}
                        />
                    )}
                </Box>
            </Stack>

            <Box sx={{ mt: 2 }}>
                <Row label={t('reservation.reservationId')} value={reservation.id} />
                <Divider />
                <Row label={t('reservation.date')} value={formattedDate} />
                <Divider />
                <Row
                    label={t('desk.title')}
                    value={reservation.desk ? reservation.desk.deskNumber : reservation.deskId}
                />
                <Divider />
                {reservation.user && (
                    <Row label={t('reservation.reservedBy')} value={reservation.user.email || 'User'} />
                )}
            </Box>
        </Container>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <Stack direction="row" spacing={2} sx={{ py: 2 }}>
            <Typography variant="subtitle1" sx={{ width: 160, fontWeight: 'bold', color: 'text.secondary' }}>
                {label}
            </Typography>
            <Typography variant="body1">
                {value}
            </Typography>
        </Stack>
    )
}