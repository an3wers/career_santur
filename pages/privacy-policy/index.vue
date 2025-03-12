<script setup lang="ts">
const { apiBase } = useRuntimeConfig().public;

definePageMeta({
  layout: "blanck-layout",
});

useHead({
  title: "Положение в отношении обработки персональных данных",
  meta: [
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
});

const { data } = await useFetch<any>("apissz/GetPost", {
  query: { id: 6998 },
  baseURL: apiBase,
});
</script>

<template>
  <div class="wrapper">
    <main>
      <h1 v-html="htmlDecoding(data?.data?.title ?? '')"></h1>
      <div v-html="htmlDecoding(data?.data?.content ?? '')"></div>
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  font-family: "OpenSansHebrew-Bold", sans-serif;
}

main {
  padding: 2rem 0;
}
</style>
