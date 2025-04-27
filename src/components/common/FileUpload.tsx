import {useCallback, useRef, useState} from 'react';
import {Alert, Box, Button, IconButton, LinearProgress, Paper, Stack, Typography,} from '@mui/material'

import {Close, Upload as UploadIcon} from '@mui/icons-material';
import {useTranslation} from "react-i18next";

interface FileUploadProps {
    onUpload: (file: File) => Promise<void>;
    accept?: string;
}

const FileUpload = ({onUpload, accept = '.csv'}: FileUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {t} = useTranslation();
    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, [])

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            await onUpload(file);
            setFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.uploadFile.error'));
        } finally {
            setLoading(false);
        }
    }
    const handleCancel = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    return (
        <Paper variant={"outlined"} sx={{p: 3, width: '100%', maxWidth: 1200, mb: 3}}>
            <Stack spacing={3}>
                <Typography variant={"h6"} component={"div"}>
                    {t('common.uploadFile.title')}
                </Typography>
                {error && (
                    <Alert severity={"error"}
                           action={
                               <IconButton size={'small'} onClick={() => setError(null)}>
                                   <Close fontSize={"small"}/>
                               </IconButton>
                           }
                    >
                        {error}
                    </Alert>
                )}
                <Box sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {borderColor: 'primary.main'}
                }} onClick={() => document.getElementById('csv-upload')?.click()}>
                    <input id={'csv-upload'}
                           ref={fileInputRef}
                           type="file"
                           accept={accept}
                           hidden
                           data-testid={"csv-upload-input"}
                           onChange={(e) => e.target.files && handleDrop([e.target.files[0]])}/>
                    <UploadIcon color={'action'} sx={{fontSize: 48, mb: 1}}/>
                    <Typography>
                        {file ? file.name : t('common.uploadFile.subtitle')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {t('common.uploadFile.caption')}
                    </Typography>
                </Box>
                {file && (
                    <>
                        {loading && <LinearProgress/>}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                data-testid={"cancel-upload-button"}
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                data-testid={"upload-button"}
                                variant="contained"
                                onClick={handleUpload}
                                disabled={loading}
                                startIcon={<UploadIcon/>}
                            >
                                {loading ? t('common.uploadFile.button.loading') : t('common.uploadFile.button.notLoading')}
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </Paper>
    )
}

export default FileUpload;