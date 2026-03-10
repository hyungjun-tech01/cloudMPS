'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0f172a', // Slate 900 - Professional dark navy/slate
            light: '#334155',
            dark: '#020617',
        },
        secondary: {
            main: '#2563eb', // Blue 600 - Modern reliable accent
            light: '#3b82f6',
            dark: '#1d4ed8',
        },
        background: {
            default: '#f8fafc', // Slate 50 - clean off-white background
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#64748b',
        },
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
        info: {
            main: '#0ea5e9',
        },
        success: {
            main: '#10b981',
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: 'var(--font-geist-sans), Roboto, "Helvetica Neue", Arial, sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderRadius: 8,
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
            defaultProps: {
                disableElevation: true,
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // subtle shadow
                },
                rounded: {
                    borderRadius: 12,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
                variant: 'outlined',
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
});

export default theme;
