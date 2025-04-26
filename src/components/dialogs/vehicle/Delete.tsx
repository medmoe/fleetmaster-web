import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {VehicleType} from "@/types/types.ts";

interface DeleteDialogProps {
    openDeleteDialog: boolean;
    setOpenDeleteDialog: (value: boolean) => void;
    vehicleToDelete: VehicleType | null;
    loading: boolean;
    handleDeleteConfirm: () => void;
}

const Delete = ({openDeleteDialog, setOpenDeleteDialog, vehicleToDelete, loading, handleDeleteConfirm}: DeleteDialogProps) => {
    const {t} = useTranslation();
    return (
        <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
        >
            <DialogTitle>{t('pages.vehicle.deleteDialog.title')}</DialogTitle>
            <DialogContent>
                <Typography>
                    {t('pages.vehicle.deleteDialog.subtitle')}
                </Typography>
                {vehicleToDelete && (
                    <Typography sx={{mt: 2, fontWeight: 'bold'}}>
                        {vehicleToDelete.make} {vehicleToDelete.model} {vehicleToDelete.registration_number}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setOpenDeleteDialog(false)}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleDeleteConfirm}
                    color="error"
                    variant="contained"
                    startIcon={loading && <CircularProgress size={20} color="inherit"/>}
                    disabled={loading}
                >
                    {t('common.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Delete;