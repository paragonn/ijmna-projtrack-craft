require("dotenv").config();

module.exports = {
    mode: "jit",

    content: [
        "./src/**/*.{html,js}",
        "./templates/**/*.{html,twig,json,php,js}",
        "./config/formie.php",
    ],
    safelist: [],
    theme: {
        container: {
            center: true,
            padding: "1rem",
        },

        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1146px",
        },
        extend: {
            fontSize: {
                "6.5xl": ["4rem", "4.875rem"],
                "4.5xl": ["2.8125rem", "3.125rem"],
                "3.5xl": ["2rem", "2.75rem"],
                "1xl": ["1.375rem", "1.687rem"],
            },

            colors: {
                // Please use variable names as "primary" , "secondary" , "ternary" and then "red", "blue" etc.,
                // All variable needs colors set main color as 500 variant and light and dark colors for rest variants.

                // Below is the example pallets. Replace according to projects need.projects
                // https://www.tailwindshades.com/
                transparent: "transparent",
                current: "currentColor",
                blue: {
                    50: "#65C8FF",
                    100: "#50C1FF",
                    200: "#27B3FF",
                    300: "#00A4FE",
                    400: "#0089D5",
                    500: "#006FAC",
                    600: "#004B74",
                    700: "#00273C",
                    800: "#101523",
                    900: "#000204",
                    950: "#000000",
                },
            },

            fontFamily: {
                //Please use font name as variable key instead sans. For example "faro: ['faro']"
                inter: ["Inter", "Arial", "sans-serif"],
                Baskervville: ["Baskervville", "Arial", "sans-serif"],
            },
        },
    },
    corePlugins: {
        aspectRatio: true,
    },
    plugins: [
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/forms"),
    ],
};
