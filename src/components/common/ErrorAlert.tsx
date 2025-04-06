// src/components/ErrorAlert.tsx
import React, {useEffect, useState} from 'react';
import {Alert, AlertTitle, Box, Collapse, IconButton, Snackbar} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {useTheme} from '@mui/material/styles';

interface ErrorAlertProps {
    message: string;
    title?: string;
    severity?: 'error' | 'warning' | 'info' | 'success';
    duration?: number; // Duration in milliseconds
    onClose?: () => void;
    showIcon?: boolean;
    position?: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'center' | 'right';
    };
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
                                                   message,
                                                   title = 'Error',
                                                   severity = 'error',
                                                   duration = 6000, // 6 seconds default
                                                   onClose,
                                                   showIcon = true,
                                                   position = {vertical: 'top', horizontal: 'center'}
                                               }) => {
    const [open, setOpen] = useState<boolean>(true);
    const theme = useTheme();

    // Auto-dismiss after duration
    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        // Cleanup timeout on unmount or when open changes
        return () => clearTimeout(timer);
    }, [open, duration]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

        // Call external onClose after animation completes
        const animationTime = 300; // Match transition time
        setTimeout(() => {
            if (onClose) onClose();
        }, animationTime);
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={position}
            slots={{transition: Collapse}}
            slotProps={{transition: {timeout: 300}}}
        >
            <Alert
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    minWidth: '300px',
                    maxWidth: '600px',
                    boxShadow: 4,
                    display: 'flex',
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                        marginRight: theme.spacing(2)
                    },
                    '& .MuiAlert-message': {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1
                    }
                }}
                action={
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        sx={{
                            opacity: 0.7,
                            '&:hover': {
                                opacity: 1
                            }
                        }}
                    >
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                }
                icon={showIcon ? <ErrorOutlineIcon/> : null}
            >
                {title && <AlertTitle sx={{fontWeight: 'bold'}}>{title}</AlertTitle>}
                <Box sx={{mt: title ? 0.5 : 0}}>{message}</Box>
            </Alert>
        </Snackbar>
    );
};

export default ErrorAlert;