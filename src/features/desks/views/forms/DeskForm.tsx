import {useEffect} from 'react'
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import {useTranslation} from 'react-i18next'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {deskSchema, type DeskFormData} from '../../schemas/deskSchema'

interface DeskFormProps {
    title: string
    submitLabel: string
    initialData?: DeskFormData // initial data for EDIT MODE
    isPending: boolean
    error: Error | null
    onSubmit: (data: DeskFormData) => void
    onCancel: () => void
}

export function DeskForm({
                             title,
                             submitLabel,
                             initialData,
                             isPending,
                             error,
                             onSubmit,
                             onCancel
                         }: DeskFormProps) {
    const {t} = useTranslation()

    const {
        register, handleSubmit,
        control, reset,
        formState: {errors}} = useForm<DeskFormData>({
        resolver: zodResolver(deskSchema),
        defaultValues: initialData || {
            deskNumber: '',
            floor: 1,
            hasDualMonitor: false,
            isStandingDesk: false,
        }
    })


    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    return (
        <Box sx={{p: 3, maxWidth: 600, mx: 'auto'}}>
            <Paper elevation={2} sx={{p: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {title}
                </Typography>

                <form onSubmit={handleSubmit((data) => onSubmit(data))} noValidate>
                    <Stack spacing={3} sx={{mt: 3}}>
                        <TextField
                            label={t('desk.number')}
                            {...register('deskNumber')}
                            error={!!errors.deskNumber} // first ! pars num>0 || "chars" in false and second ! in truth. MUI Textfield needs boolean not num 
                            helperText={errors.deskNumber?.message}
                            required
                            fullWidth
                            placeholder="e.g., A-101"
                        />

                        <TextField
                            label={t('desk.floor')}
                            type="number"
                            {...register('floor', {valueAsNumber: true})} // valueAsNumber parse "1" to 1
                            error={!!errors.floor}
                            helperText={errors.floor?.message}
                            required
                            fullWidth
                        />

                        <Controller // cause we use difficult type "checked" we need to use it from RHF 
                            name="hasDualMonitor"
                            control={control} //Through it, the controller understands which particular form instance it is bound to.
                            render={({field}) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)} //✓ Manual click processing. We need to pass the check mark state.
                                        />
                                    }
                                    label={t('desk.dualMonitor')}
                                />
                            )}
                        />

                        <Controller
                            name="isStandingDesk"
                            control={control}
                            render={({field}) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                    label={t('desk.standingDesk')}
                                />
                            )}
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
