import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Saira, sans-serif',
  primaryColor: 'blue',
  colors: {
    blue: [
      '#E3F2FD',
      '#BBDEFB',
      '#90CAF9',
      '#64B5F6',
      '#42A5F5',
      '#1E88E5',
      '#1976D2',
      '#1565C0',
      '#0D47A1',
      '#0A2F69',
    ],
  },
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  components: {
    Modal: {
      styles: {
        modal: {
          backgroundColor: "rgba(22, 22, 32, 0.9)",
          borderRadius: 12,
        },
      },
    },

    TextInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(112, 162, 204, 0.1)',
          border: 'solid 1px rgba(30, 136, 229, 0.3)',
          transition: 'all 0.3s ease',
          '&:focus': {
            backgroundColor: 'rgba(112, 162, 204, 0.2)',
            borderColor: theme.colors.blue[5],
          },
        },
      }),
    },

    TimeInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(112, 162, 204, 0.1)',
          border: 'solid 1px rgba(112, 162, 204, 0.3)',
          transition: 'all 0.3s ease',
          '&:focus': {
            backgroundColor: 'rgba(112, 162, 204, 0.2)',
            borderColor: theme.colors.blue[5],
          },
        },
      }),
    },

    Select: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(112, 162, 204, 0.1)',
          border: 'solid 1px rgba(112, 162, 204, 0.25)',
          transition: 'all 0.3s ease',
          '&:focus': {
            backgroundColor: 'rgba(112, 162, 204, 0.2)',
            borderColor: theme.colors.blue[4],
          },
        },
        dropdown: {
          backgroundColor: 'rgba(22, 22, 32, 0.98)',
          borderColor: theme.colors.blue[6],
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
        item: {
          '&[data-selected]': {
            backgroundColor: theme.colors.blue[7],
            '&:hover': {
              backgroundColor: theme.colors.blue[6],
            },
          },
          '&[data-hovered]': {
            backgroundColor: 'rgba(112, 162, 204, 0.15)',
          },
        },
      }),
    },

    MultiSelect: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(112, 162, 204, 0.1)',
          border: 'solid 1px rgba(112, 162, 204, 0.25)',
          transition: 'all 0.3s ease',
          '&:focus': {
            backgroundColor: 'rgba(112, 162, 204, 0.2)',
            borderColor: theme.colors.blue[4],
          },
        },
        dropdown: {
          backgroundColor: 'rgba(22, 22, 32, 0.98)',
          borderColor: theme.colors.blue[6],
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        },
        item: {
          '&[data-selected]': {
            backgroundColor: theme.colors.blue[7],
            '&:hover': {
              backgroundColor: theme.colors.blue[6],
            },
          },
          '&[data-hovered]': {
            backgroundColor: 'rgba(112, 162, 204, 0.15)',
          },
        },
      }),
    },

    NumberInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(112, 162, 204, 0.1)',
          border: 'solid 1px rgba(112, 162, 204, 0.3)',
          transition: 'all 0.3s ease',
          '&:focus': {
            backgroundColor: 'rgba(112, 162, 204, 0.2)',
            borderColor: theme.colors.blue[5],
          },
        },
      }),
    },

    Checkbox: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(112, 162, 204, 0.1)',
          borderColor: theme.colors.blue[5],
          '&:checked': {
            backgroundColor: theme.colors.blue[6],
            borderColor: theme.colors.blue[5],
          },
        },
      }),
    },

    PasswordInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'rgba(30, 136, 229, 0.1)',
          border: 'solid 1px rgba(30, 136, 229, 0.3)',
          transition: 'all 0.3s ease',
          '&:focus-within': {
            backgroundColor: 'rgba(30, 136, 229, 0.2)',
            borderColor: theme.colors.blue[5],
          },
        },
        innerInput: {
          '&::placeholder': {
            color: theme.colors.gray[5],
          },
        },
        visibilityToggle: {
          color: theme.colors.blue[5],
          '&:hover': {
            backgroundColor: 'rgba(30, 136, 229, 0.1)',
          },
        },
      }),
    },
  },
  globalStyles: (theme) => ({
    '.mantine-Slider-root': {
      padding: '10px 0',
    },
    '.mantine-Slider-track': {
      backgroundColor: 'rgba(30, 136, 229, 0.1)',
      '&:before': {
        backgroundColor: 'rgba(30, 136, 229, 0.25)',
      },
    },
    '.mantine-Slider-bar': {
      backgroundColor: theme.colors.blue[4],
    },
    '.mantine-Slider-thumb': {
      borderColor: theme.colors.blue[4],
      backgroundColor: theme.colors.blue[2],
      '&:hover': {
        borderColor: theme.colors.blue[3],
        backgroundColor: theme.colors.blue[3],
      },
    },
    '.mantine-Slider-mark': {
      borderColor: theme.colors.blue[3],
      backgroundColor: theme.colors.blue[3],
    },
    '.mantine-Slider-markLabel': {
      fontSize: '12px',
      color: theme.colors.gray[5],
    },
  }),
};