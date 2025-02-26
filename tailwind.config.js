/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const round = (num) =>
    num
        .toFixed(7)
        .replace(/(\.[0-9]+?)0+$/, '$1')
        .replace(/\.0$/, '');
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;
const hexToRgb = (hex) => {
    hex = hex.replace('#', '')
    hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `${r} ${g} ${b}`
};

module.exports = {
    important: true,
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            typography: () => ({
                DEFAULT: { // this is for prose class
                    css: {
                        // color: theme('colors.yourSpecificColor'), // change global color scheme
                        // p: {
                        //     fontSize: '14px', // key can be in camelCase...
                        //     'text-align': 'center', // or as it is in css (but in quotes).
                        // },
                        // a: {
                        //     // change anchor color and on hover
                        //     color: '#03989E',
                        //     '&:hover': { // could be any. It's like extending css selector
                        //         color: '#F7941E',
                        //     },
                        // },
                        // ul: {
                        //     '> li': {
                        //         '&::before': { // more complex example - add before to an li element.
                        //             content: '',
                        //             ....,
                        //         },
                        //     },
                        // },
                        h2: {
                            '> a': {
                                textDecoration: 'none', color: 'inherit',
                                '> code': { fontSize: 'inherit' },
                            },
                        },
                        h3: {
                            '> a': {
                                textDecoration: 'none', color: 'inherit',
                                '> code': { fontSize: 'inherit', fontWeight: 'inherit' },
                            },
                        },
                        h4: {
                            '> a': {
                                textDecoration: 'none', color: 'inherit',
                                '> code': { fontSize: 'inherit', fontWeight: 'inherit' },
                            },
                        },
                        h5: {
                            '> a': {
                                textDecoration: 'none', color: 'inherit',
                                '> code': { fontSize: 'inherit', fontWeight: 'inherit' },
                            },
                        },
                        h6: {
                            '> a': {
                                textDecoration: 'none', color: 'inherit',
                                '> code': { fontSize: 'inherit', fontWeight: 'inherit' },
                            },
                        },
                    },
                },

                zinc1: {
                    css: {
                        '--tw-prose-body': colors.zinc['600'],
                        '--tw-prose-headings': colors.zinc['700'],
                        '--tw-prose-lead': colors.zinc['600'],
                        '--tw-prose-links': colors.zinc['800'],
                        '--tw-prose-bold': colors.zinc['900'],
                        '--tw-prose-counters': colors.zinc['500'],
                        '--tw-prose-bullets': colors.zinc['300'],
                        '--tw-prose-hr': colors.zinc[200],
                        '--tw-prose-quotes': colors.zinc[900],
                        '--tw-prose-quote-borders': colors.zinc[200],
                        '--tw-prose-captions': colors.zinc[500],
                        '--tw-prose-kbd': colors.zinc[900],
                        '--tw-prose-kbd-shadows': hexToRgb(colors.zinc[900]),
                        '--tw-prose-code': colors.zinc[800],
                        '--tw-prose-pre-code': colors.zinc[200],
                        '--tw-prose-pre-bg': colors.zinc[800],
                        '--tw-prose-th-borders': colors.zinc[300],
                        '--tw-prose-td-borders': colors.zinc[200],
                        '--tw-prose-invert-body': colors.zinc['400'],
                        '--tw-prose-invert-headings': colors.zinc[300],
                        '--tw-prose-invert-lead': colors.zinc[400],
                        '--tw-prose-invert-links': colors.zinc[200],
                        '--tw-prose-invert-bold': colors.zinc[200],
                        '--tw-prose-invert-counters': colors.zinc[400],
                        '--tw-prose-invert-bullets': colors.zinc[600],
                        '--tw-prose-invert-hr': colors.zinc[700],
                        '--tw-prose-invert-quotes': colors.zinc[100],
                        '--tw-prose-invert-quote-borders': colors.zinc[700],
                        '--tw-prose-invert-captions': colors.zinc[400],
                        '--tw-prose-invert-kbd': colors.white,
                        '--tw-prose-invert-kbd-shadows': hexToRgb(colors.white),
                        '--tw-prose-invert-code': colors.zinc[300],
                        '--tw-prose-invert-pre-code': colors.zinc[300],
                        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
                        '--tw-prose-invert-th-borders': colors.zinc[600],
                        '--tw-prose-invert-td-borders': colors.zinc[700],
                    },
                },

                slate1: {
                    css: {
                        '--tw-prose-body': colors.slate['600'],
                        '--tw-prose-headings': colors.slate['700'],
                        '--tw-prose-lead': colors.slate['600'],
                        '--tw-prose-links': colors.slate['800'],
                        '--tw-prose-bold': colors.slate['900'],
                        '--tw-prose-counters': colors.slate['500'],
                        '--tw-prose-bullets': colors.slate['300'],
                        '--tw-prose-hr': colors.slate[200],
                        '--tw-prose-quotes': colors.slate[900],
                        '--tw-prose-quote-borders': colors.slate[200],
                        '--tw-prose-captions': colors.slate[500],
                        '--tw-prose-kbd': colors.slate[900],
                        '--tw-prose-kbd-shadows': hexToRgb(colors.slate[900]),
                        '--tw-prose-code': colors.slate[800],
                        '--tw-prose-pre-code': colors.slate[200],
                        '--tw-prose-pre-bg': colors.slate[800],
                        '--tw-prose-th-borders': colors.slate[300],
                        '--tw-prose-td-borders': colors.slate[200],
                        '--tw-prose-invert-body': colors.slate['400'],
                        '--tw-prose-invert-headings': colors.slate[300],
                        '--tw-prose-invert-lead': colors.slate[400],
                        '--tw-prose-invert-links': colors.slate[200],
                        '--tw-prose-invert-bold': colors.slate[200],
                        '--tw-prose-invert-counters': colors.slate[400],
                        '--tw-prose-invert-bullets': colors.slate[600],
                        '--tw-prose-invert-hr': colors.slate[700],
                        '--tw-prose-invert-quotes': colors.slate[100],
                        '--tw-prose-invert-quote-borders': colors.slate[700],
                        '--tw-prose-invert-captions': colors.slate[400],
                        '--tw-prose-invert-kbd': colors.white,
                        '--tw-prose-invert-kbd-shadows': hexToRgb(colors.white),
                        '--tw-prose-invert-code': colors.slate[200],
                        '--tw-prose-invert-pre-code': colors.slate[300],
                        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
                        '--tw-prose-invert-th-borders': colors.slate[600],
                        '--tw-prose-invert-td-borders': colors.slate[700],
                    },
                },

                pink: {
                    css: {
                        '--tw-prose-body': 'var(--color-pink-800)',
                        '--tw-prose-headings': 'var(--color-pink-900)',
                        '--tw-prose-lead': 'var(--color-pink-700)',
                        '--tw-prose-links': 'var(--color-pink-900)',
                        '--tw-prose-bold': 'var(--color-pink-900)',
                        '--tw-prose-counters': 'var(--color-pink-600)',
                        '--tw-prose-bullets': 'var(--color-pink-400)',
                        '--tw-prose-hr': 'var(--color-pink-300)',
                        '--tw-prose-quotes': 'var(--color-pink-900)',
                        '--tw-prose-quote-borders': 'var(--color-pink-300)',
                        '--tw-prose-captions': 'var(--color-pink-700)',
                        '--tw-prose-code': 'var(--color-pink-900)',
                        '--tw-prose-pre-code': 'var(--color-pink-100)',
                        '--tw-prose-pre-bg': 'var(--color-pink-900)',
                        '--tw-prose-th-borders': 'var(--color-pink-300)',
                        '--tw-prose-td-borders': 'var(--color-pink-200)',
                        '--tw-prose-invert-body': 'var(--color-pink-200)',
                        '--tw-prose-invert-headings': 'var(--color-white)',
                        '--tw-prose-invert-lead': 'var(--color-pink-300)',
                        '--tw-prose-invert-links': 'var(--color-white)',
                        '--tw-prose-invert-bold': 'var(--color-white)',
                        '--tw-prose-invert-counters': 'var(--color-pink-400)',
                        '--tw-prose-invert-bullets': 'var(--color-pink-600)',
                        '--tw-prose-invert-hr': 'var(--color-pink-700)',
                        '--tw-prose-invert-quotes': 'var(--color-pink-100)',
                        '--tw-prose-invert-quote-borders': 'var(--color-pink-700)',
                        '--tw-prose-invert-captions': 'var(--color-pink-400)',
                        '--tw-prose-invert-code': 'var(--color-white)',
                        '--tw-prose-invert-pre-code': 'var(--color-pink-300)',
                        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
                        '--tw-prose-invert-th-borders': 'var(--color-pink-600)',
                        '--tw-prose-invert-td-borders': 'var(--color-pink-700)',
                    },
                },
            }),
        },
    },
    variants: {},
    plugins: [require('@tailwindcss/typography')],
}