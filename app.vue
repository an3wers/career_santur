<template>
  <div class="page">
    <AppHeader />
    <NuxtPage :page-key="(route) => route.fullPath" />
    <AppFooter />
  </div>
</template>
