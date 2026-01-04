import { Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Box, Typography, Stack, Button, Container, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { desksModule } from '../module'
import { useAuthStore } from '../../auth/store/authStore'
import { DeleteEntityButton } from '../../../shared/components/DeleteButton'
import { useTranslation } from 'react-i18next'
import { usePermissions } from '../../../shared/hooks/usePermissions'

export default function DeskView() {
    const { t } = useTranslation()
    const isAuth = useAuthStore(s => !!s.user)
    const { id } = desksModule.routes.view.useParams()
    const navigate = useNavigate()

    const { data: desk } = useSuspenseQuery(desksModule.queries.getById(id))

    const { canEdit, canDelete } = usePermissions(desk?.actions)

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    {t('desk.title')} {desk.deskNumber}
                </Typography>

                <Box sx={{ ml: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to={desksModule.routes.list.to}
                        startIcon={<ArrowBackIcon />}
                        variant="text"
                    >
                        {t('common.back')}
                    </Button>

                    {isAuth && canEdit && (
                        <Button
                            component={Link}
                            to={desksModule.routes.edit.to}
                            params={{ id: desk.id }}
                            startIcon={<EditIcon />}
                            variant="outlined"
                        >
                            {t('common.edit')}
                        </Button>
                    )}

                    {isAuth && canDelete && (
                        <DeleteEntityButton
                            id={desk.id}
                            title={`desk ${desk.deskNumber}`}
                            mutation={desksModule.queries.delete}
                            invalidateKey={[desksModule.id]}
                            onDeleted={() => navigate({ to: desksModule.routes.list.to })}
                        />
                    )}
                </Box>
            </Stack>

            <Box sx={{ mt: 2 }}>
                <Row label={t('common.id')} value={desk.id} />
                <Divider />
                <Row label={t('desk.number')} value={desk.deskNumber} />
                <Divider />
                <Row label={t('desk.floor')} value={String(desk.floor)} />
                <Divider />
                <Row label={t('desk.dualMonitor')} value={desk.hasDualMonitor ? t('common.yes') : t('common.no')} />
                <Divider />
                <Row label={t('desk.standingDesk')} value={desk.isStandingDesk ? t('common.yes') : t('common.no')} />
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