module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.indigo.600'),
              '&:hover': {
                color: theme('colors.indigo.500'),
              },
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2rem 0.4rem',
              borderRadius: theme('borderRadius.sm'),
            },
            'pre code': {
              backgroundColor: 'transparent',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: { color: theme('colors.indigo.400') },
            code: { backgroundColor: theme('colors.gray.800') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
