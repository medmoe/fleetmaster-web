import {useCallback, useState} from 'react';
import {Alert, Box, Button, IconButton, LinearProgress, Paper, Stack, Typography,} from '@mui/material'

import {Close, Upload as UploadIcon} from '@mui/icons-material';

interface FileUploadProps {
    onUpload: (file: File) => Promise<void>;
    accept?: string;
}

const FileUpload = ({onUpload, accept = '.csv'}: FileUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

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
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Paper variant={"outlined"} sx={{p: 3, width: '100%', maxWidth: 800, mb: 3}}>
            <Stack spacing={3}>
                <Typography variant={"h6"} component={"div"}>
                    Import CSV File
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
                           type="file"
                           accept={accept}
                           hidden
                           onChange={(e) => e.target.files && handleDrop([e.target.files[0]])}/>
                    <UploadIcon color={'action'} sx={{fontSize: 48, mb: 1}}/>
                    <Typography>
                        {file ? file.name : 'Drag & drop or click to select'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Only CSV files accepted
                    </Typography>
                </Box>
                {file && (
                    <>
                        {loading && <LinearProgress/>}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() => setFile(null)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={loading}
                                startIcon={<UploadIcon/>}
                            >
                                {loading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </Paper>
    )
}

export default FileUpload;