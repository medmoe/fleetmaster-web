import {useTranslation} from 'react-i18next';
import {Button, Menu, MenuItem} from '@mui/material';
import {useState} from 'react';
import {Language} from '@mui/icons-material';

const LanguageSwitcher = () => {
    const {i18n} = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        document.dir = language === 'ar' ? 'rtl' : 'ltr';
        handleClose();
    };

    return (
        <div>
            <Button
                id="language-button"
                aria-controls={open ? 'language-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                startIcon={<Language/>}
            >
                {i18n.language === 'ar' ? 'العربية' : 'English'}
            </Button>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {'aria-labelledby': 'language-button'}
                }}
            >
                <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                <MenuItem onClick={() => changeLanguage('ar')}>العربية</MenuItem>
            </Menu>
        </div>
    );
};

export default LanguageSwitcher;