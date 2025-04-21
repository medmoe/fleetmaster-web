// ThemeConfig.tsx
import React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {useTranslation} from 'react-i18next';

// Create RTL cache
const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});

// Create LTR cache
const ltrCache = createCache({
    key: 'muiltr',
});

interface ThemeConfigProps {
    children: React.ReactNode;
}

export const ThemeConfig: React.FC<ThemeConfigProps> = ({children}) => {
    const {i18n} = useTranslation();
    const isRtl = i18n.language === 'ar';

    const theme = createTheme({
        direction: isRtl ? 'rtl' : 'ltr',
        // Your other theme settings
    });

    return (
        <CacheProvider value={isRtl ? rtlCache : ltrCache}>
            <ThemeProvider theme={theme}>
                <div dir={isRtl ? 'rtl' : 'ltr'} style={{width: '100%', height: '100%'}}>
                    {children}
                </div>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default ThemeConfig;