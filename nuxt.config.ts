// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
      htmlAttrs: {
        lang: "ru",
      },
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  },

  ssr: true,

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "https://career.santur.ru/",
    },
  },

  routeRules:
    process.env.NODE_ENV === "development"
      ? {
          "/apissz/**": {
            proxy: {
              to: "https://isantur.ru/apissz/**",
            },
          },
        }
      : {},

  css: ["~/assets/styles/style.css"],

  devServer: {
    port: 3000,
  },

  modules: ["@nuxt/eslint"],
  compatibilityDate: "2025-01-30",
});
