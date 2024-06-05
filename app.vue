<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Карьера в Сантехкомплект-Урал`
      : "Карьера в Сантехкомплект-Урал";
  },
});
</script>

<template>
  <div class="page">
    <AppHeader />
    <NuxtPage :page-key="(route) => route.fullPath" />
    <AppFooter />
  </div>
</template>
