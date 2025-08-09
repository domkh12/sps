import {createTheme} from '@mui/material/styles';
import {indigo} from '@mui/material/colors';

export const getTheme = (mode) =>
    createTheme({
        colorSchemes: {
            dark: true,
        },
        palette: {
            primary: {
                main: indigo[600],
            },
            secondary: {
                main: indigo[900],
            },
        },

        typography: {
            fontFamily: ['Roboto', 'Hanuman', 'Arial', 'sans-serif'].join(','),
        },

        components: {

            MuiCssBaseline: {
                styleOverrides: (theme) => ({
                    body: {
                        // Webkit browsers (Chrome, Safari, Edge)
                        '*::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px',
                        },
                        '*::-webkit-scrollbar-track': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f1f1f1',
                        },
                        '*::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#6b6b6b' : '#c1c1c1',
                            borderRadius: '4px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#888' : '#a8a8a8',
                            },
                        },
                        '*::-webkit-scrollbar-thumb:active': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#999',
                        },
                        // Firefox
                        scrollbarWidth: 'thin',
                        scrollbarColor: theme.palette.mode === 'dark'
                            ? '#6b6b6b #2b2b2b'
                            : '#c1c1c1 #f1f1f1',
                    },
                }),
            },

            MuiTableHead: {
              styleOverrides: {
                  root: ({ theme }) => ({
                      backgroundColor: theme.palette.mode === 'dark'
                          ? theme.palette.grey[800]
                          : theme.palette.grey[100],
                      '& .MuiTableCell-head': {
                          backgroundColor: theme.palette.mode === 'dark'
                              ? theme.palette.grey[800]
                              : theme.palette.grey[100],
                          color: theme.palette.mode === 'dark'
                              ? theme.palette.common.white
                              : theme.palette.text.primary,
                          fontWeight: 600,
                          borderBottom: theme.palette.mode === 'dark'
                              ? `1px solid ${theme.palette.grey[700]}`
                              : `1px solid ${theme.palette.grey[300]}`,
                      }
                  })
              }
            },

            MuiPopover: {
                styleOverrides: {
                    paper: {
                        borderRadius: "10px",
                    },
                },
            },

            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        border: "none",
                        borderRadius: "8px"
                    },
                }
            },

            MuiListSubheader: {
                variants: [
                    {
                        props: {variant: 'cus1'},
                        style: {
                            borderRadius: "5px",
                            pointerEvents: "none",
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }
                    }
                ]
            },

            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiInputBase-input": {
                            boxShadow: "none",
                        },
                        borderRadius: "9px"
                    }
                }
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        "& .MuiInputBase-input": {
                            boxShadow: "none",
                        },
                        borderRadius: "9px"
                    }
                }
            },

            MuiTabPanel: {
                styleOverrides: {
                    root: {
                        padding: "24px 0px"
                    }
                }
            },

            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontSize: "1rem",
                    }
                }
            },

            MuiButton: {
                styleOverrides: {
                    outlined:{
                        borderRadius: '8px',
                    },
                    contained: {
                        borderRadius: '8px',
                    },
                    root: {
                        textTransform: 'none',
                    }
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : "",
                        borderRadius: "14px",
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",

                    })
                },

            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        variants: [
                            {
                                style: {
                                    transition: 'all 0.3s ease',
                                },
                            },
                        ],
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: "0px"
                    }
                },
                defaultProps: {
                    elevation: 0,
                },

            },

            MuiList: {
                variants: [
                    {
                        props: {variant: 'customStyled'},
                        style: {
                            borderRadius: "10px",
                            padding: "6px",
                            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
                            marginTop: "0.5rem",
                            "& .MuiList-root": {
                                padding: "0",
                                display: "grid",
                                gap: "6px",
                                background: "transparent"
                            },
                        },
                    },
                ],
            },

            MuiTypography: {
                variants: [
                    {
                        props: {variant: 'description'},
                        style: {
                            fontSize: "14px"
                        },
                    },
                ],
            },



        },
    });
