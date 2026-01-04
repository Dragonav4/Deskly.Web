import { Link, useNavigate} from '@tanstack/react-router'
import {useSuspenseQuery} from '@tanstack/react-query'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Container,
    Stack,
    TablePagination
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'

import {desksModule} from '../module'
import {useAuthStore} from '../../auth/store/authStore'
import {useTranslation} from 'react-i18next'
import {usePermissions} from '../../../shared/hooks/usePermissions'
import type { ChangeEvent } from "react"

export function DesksListView() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { page, size } = desksModule.routes.list.useSearch()
    const { data } = useSuspenseQuery(desksModule.queries.getAll({ page, size }))

    const isAuth = useAuthStore(s => !!s.user)

    const { items, actions, totalCount } = data
    const { canCreate } = usePermissions(actions)

    const handleChangePage = (_: any, newPage: number) => {
        navigate({ to: ".", search: (prev: any) => ({ ...prev, page: newPage }) })
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        navigate({
            to: '.',
            search: (prev: any) => ({ ...prev, size: parseInt(event.target.value, 10), page: 0 })
        })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1">
                    {t('desk.listTitle')}
                </Typography>

                {isAuth && canCreate && (
                    <Button
                        component={Link}
                        to={desksModule.routes.create.to}
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {t('desk.createDesk')}
                    </Button>
                )}
            </Stack>

            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }} aria-label="desks table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('desk.number')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{t('desk.floor')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('common.options')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((desk) => (
                            <TableRow
                                key={desk.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {desk.deskNumber}
                                </TableCell>
                                <TableCell>{desk.floor}</TableCell>
                                <TableCell align="right">
                                    <Link
                                        to={desksModule.routes.view.to}
                                        params={{ id: desk.id }}
                                        style={{ textDecoration: 'none', marginRight: '8px' }} // Add margin for spacing
                                    >
                                        <Button
                                            variant="outlined" // Changed to outlined for consistency with new button
                                            startIcon={<VisibilityIcon />}
                                            size="small"
                                        >
                                            {t('common.view')}
                                        </Button>
                                    </Link>
                                    {usePermissions(desk.actions).canEdit && (
                                        <Link
                                            to={desksModule.routes.edit.to} // Assuming an 'edit' route exists or using a placeholder
                                            params={{ id: desk.id }}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button
                                                variant="outlined"
                                                startIcon={<EditIcon />}
                                                size="small"
                                            >
                                                {t('common.edit')}
                                            </Button>
                                        </Link>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalCount || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={size}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Container>
    )
}

export default DesksListView
