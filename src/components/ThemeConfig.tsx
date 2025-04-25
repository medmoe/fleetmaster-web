// ThemeConfig.tsx
import React from 'react';
import {createTheme, responsiveFontSizes, ThemeProvider} from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {useTranslation} from 'react-i18next';
import {CssBaseline} from '@mui/material';

// Create RTL cache
const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});

// Create LTR cache
const ltrCache = createCache({
    key: 'muiltr',
});

// Define your color palette as JavaScript objects
const palette = {
    primary: {
        100: '#e3e6f7',
        200: '#b5bfed',
        300: '#8a9ae2',
        400: '#6477d8',
        500: '#3f51b5', // Main primary color
        600: '#3847a3',
        700: '#303d91',
        800: '#293380',
        900: '#20276d',
        main: '#3f51b5', // Same as 500
        light: '#8a9ae2', // Same as 300
        dark: '#303d91', // Same as 700
        contrastText: '#ffffff',
    },
    secondary: {
        100: '#fff3e0',
        200: '#ffe0b2',
        300: '#ffcc80',
        400: '#ffb74d',
        500: '#ffa726',
        600: '#fb8c00',
        700: '#f57c00',
        800: '#ef6c00',
        900: '#e65100',
        main: '#fb8c00', // Same as 600
        light: '#ffcc80', // Same as 300
        dark: '#ef6c00', // Same as 800
        contrastText: '#ffffff',
    },
    accent: {
        100: '#f4e6f6',
        200: '#d9a1e2',
        300: '#c57ed6',
        400: '#b15bc9',
        500: '#9c27b0',
        600: '#891fa0',
        700: '#76188e',
        800: '#62107d',
        900: '#4e0a6b',
        main: '#9c27b0', // Same as 500
    },
    success: {
        100: '#eaf5ec',
        200: '#cbe6d0',
        300: '#aad7b4',
        400: '#89c799',
        500: '#68b77d',
        main: '#68b77d', // Same as 500
        light: '#aad7b4', // Same as 300
        dark: '#3e724d', // Same as 700
        contrastText: '#ffffff',
    },
    error: {
        100: '#fde8e6',
        200: '#fccbc3',
        300: '#faafa0',
        400: '#f8937c',
        500: '#f76751',
        main: '#f76751', // Same as 500
        light: '#faafa0', // Same as 300
        dark: '#d93526', // Same as 700
        contrastText: '#ffffff',
    },
    warning: {
        main: '#ffc107',
        light: '#ffecb3',
        dark: '#ff8f00',
        contrastText: '#000000',
    },
    text: {
        primary: '#263238', // --color-txt
        secondary: '#546e7a',
        disabled: '#9BA1A6', // --color-default
    },
    background: {
        default: '#f5f5f5', // --color-background
        paper: '#ffffff',
    },
};

interface ThemeConfigProps {
    children: React.ReactNode;
}

// Declare the module augmentation for the custom palette
declare module '@mui/material/styles' {
    interface PaletteOptions {
        custom?: typeof palette;
    }

    interface Palette {
        custom: typeof palette;
    }

    interface ThemeOptions {
        palette?: PaletteOptions;
    }
}

export const ThemeConfig: React.FC<ThemeConfigProps> = ({children}) => {
    const {i18n} = useTranslation();
    const isRtl = i18n.language === 'ar';

    // Create the theme with our custom palette
    const theme = responsiveFontSizes(createTheme({
        direction: isRtl ? 'rtl' : 'ltr',
        palette: {
            primary: {
                main: palette.primary.main,
                light: palette.primary.light,
                dark: palette.primary.dark,
                contrastText: palette.primary.contrastText,
            },
            secondary: {
                main: palette.secondary.main,
                light: palette.secondary.light,
                dark: palette.secondary.dark,
                contrastText: palette.secondary.contrastText,
            },
            error: {
                main: palette.error.main,
                light: palette.error.light,
                dark: palette.error.dark,
                contrastText: palette.error.contrastText,
            },
            warning: {
                main: palette.warning.main,
                light: palette.warning.light,
                dark: palette.warning.dark,
                contrastText: palette.warning.contrastText,
            },
            success: {
                main: palette.success.main,
                light: palette.success.light,
                dark: palette.success.dark,
                contrastText: palette.success.contrastText,
            },
            text: {
                primary: palette.text.primary,
                secondary: palette.text.secondary,
                disabled: palette.text.disabled,
            },
            background: {
                default: palette.background.default,
                paper: palette.background.paper,
            },
            // Add custom palette to theme
            custom: palette,
        },
        typography: {
            fontFamily: [
                'Roboto',
                'Open Sans',
                'Merriweather',
                'sans-serif',
            ].join(','),
            h1: {
                fontFamily: 'Merriweather, serif',
            },
            h2: {
                fontFamily: 'Merriweather, serif',
            },
            h3: {
                fontFamily: 'Merriweather, serif',
            },
            h4: {
                fontFamily: 'Merriweather, serif',
            },
            h5: {
                fontFamily: 'Merriweather, serif',
            },
            h6: {
                fontFamily: 'Merriweather, serif',
            },
            body1: {
                fontFamily: 'Open Sans, sans-serif',
            },
            body2: {
                fontFamily: 'Open Sans, sans-serif',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: palette.background.default,
                        color: palette.text.primary,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
    }));

    return (
        <CacheProvider value={isRtl ? rtlCache : ltrCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div dir={isRtl ? 'rtl' : 'ltr'} style={{width: '100%', height: '100%'}}>
                    {children}
                </div>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default ThemeConfig;