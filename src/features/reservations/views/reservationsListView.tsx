import { Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
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

import { reservationModule } from '../module'
import { useAuthStore } from '../../auth/store/authStore'
import { useTranslation } from 'react-i18next'
import { usePermissions } from '../../../shared/hooks/usePermissions'
import type { ChangeEvent } from 'react'

export function ReservationsListView() {
     const { t } = useTranslation()
     const navigate = useNavigate()
     const { page, size } = reservationModule.routes.list.useSearch()
     const { data } = useSuspenseQuery(reservationModule.queries.getAll({ page, size }))
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
                         {t('reservation.listTitle')}
                    </Typography>

                    {isAuth && canCreate && (
                         <Button
                              component={Link}
                              to={reservationModule.routes.create.to}
                              variant="contained"
                              startIcon={<AddIcon />}
                              sx={{ ml: 'auto' }}
                         >
                              {t('reservation.createReservation')}
                         </Button>
                    )}
               </Stack>

               <TableContainer component={Paper} elevation={2}>
                    <Table sx={{ minWidth: 650 }} aria-label="reservations table">
                         <TableHead>
                              <TableRow>
                                   <TableCell sx={{ fontWeight: 'bold' }}>{t('reservation.date')}</TableCell>
                                   <TableCell sx={{ fontWeight: 'bold' }}>{t('desk.number')}</TableCell>
                                   <TableCell sx={{ fontWeight: 'bold' }}>{t('reservation.reservedBy')}</TableCell>
                                   <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('common.options')}</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {items?.map((res) => (
                                   <TableRow
                                        key={res.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                   >
                                        <TableCell>
                                             {new Date(res.reservationDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{res.desk?.deskNumber ?? 'N/A'}</TableCell>
                                        <TableCell>{res.user?.email ?? 'N/A'}</TableCell>
                                        <TableCell align="right">
                                             <Link
                                                  to={reservationModule.routes.view.to}
                                                  params={{ id: res.id }}
                                                  style={{ textDecoration: 'none' }}
                                             >
                                                  <Button
                                                       startIcon={<VisibilityIcon />}
                                                       size="small"
                                                  >
                                                       {t('common.view')}
                                                  </Button>
                                             </Link>
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

export default ReservationsListView