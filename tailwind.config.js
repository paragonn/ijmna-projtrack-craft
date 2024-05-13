require('dotenv').config();

/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        "./src/**/*.{html,js}",
        // "./web/**/*.{html,twig,json,php,js}",
        "./templates/**/*.{html,twig,json,php,js}"
    ],
    safelist: (process.env.PURGE_CSS == "true" ? [] : [{ pattern: /.*/ }]),
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1.125rem',
                sm: '2rem',
                lg: '2.5rem',
            }
        },
        screens: {
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1460px',
            // => @media (min-width: 1460px) { ... }

            '2xl': '1920px',
            // => @media (min-width: 1460px) { ... }
        },

        extend: {
            colors: {
                // Example
                /*'red': {
                    '50': '#FFF8F2',
                    '100': '#FFF1E6',
                    '200': '#FFD8BF',
                    '300': '#FFB899',
                    '400': '#FF674D',
                    '500': '#FF0000',
                    '600': '#E60000',
                    '700': '#BF0000',
                    '800': '#990000',
                    '900': '#730000',
                    '950': '#4A0000'
                },*/
            },
        },
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
    ],
}
