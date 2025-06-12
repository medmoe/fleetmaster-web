import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"

import {useTranslation} from "react-i18next";
import DialogActions from "@mui/material/DialogActions";
import {CircularProgress} from "@mui/material";

interface UpdateAccessCodeProps {
    openUpdateDialog: boolean
    setOpenUpdateDialog: (openUpdateDialog: boolean) => void
    loading: boolean
    handleUpdateConfirm: () => void
}

const AccessCode = ({openUpdateDialog, setOpenUpdateDialog, loading, handleUpdateConfirm}: UpdateAccessCodeProps) => {
    const {t} = useTranslation();
    return (
        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
            <DialogTitle>
                {t('pages.driver.updateDialog.title')}
            </DialogTitle>
            <DialogContent>
                <Typography>{t('pages.driver.updateDialog.subtitle')}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenUpdateDialog(false)}>{t('common.cancel')}</Button>
                <Button
                    onClick={handleUpdateConfirm}
                    color="error"
                    variant="contained"
                    startIcon={loading && <CircularProgress size={20} color={"inherit"}/>}
                    disabled={loading}
                >
                    {t('common.update')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AccessCode;