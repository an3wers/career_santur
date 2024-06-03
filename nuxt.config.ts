// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: "ru",
      },
    },
  },
  ssr: true,

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/"
          : "https://isantur.ru/",
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
});
