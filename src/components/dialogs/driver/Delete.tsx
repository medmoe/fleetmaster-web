import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {DriverType} from "@/types/types.ts";

interface DeleteDialogProps {
    openDeleteDialog: boolean;
    setOpenDeleteDialog: (value: boolean) => void;
    driverToDelete: DriverType | null;
    loading: boolean;
    handleDeleteConfirm: () => void;
}

const Delete = ({openDeleteDialog, setOpenDeleteDialog, driverToDelete, loading, handleDeleteConfirm}: DeleteDialogProps) => {
    const {t} = useTranslation();
    return (
        <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
        >
            <DialogTitle>{t('pages.driver.deleteDialog.title')}</DialogTitle>
            <DialogContent>
                <Typography>
                    {t('pages.driver.deleteDialog.subtitle')}
                </Typography>
                {driverToDelete && (
                    <Typography sx={{mt: 2, fontWeight: 'bold'}}>
                        {driverToDelete.first_name} {driverToDelete.last_name}
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