<script setup lang="ts">
const { apiBase } = useRuntimeConfig().public;
const { params } = useRoute();

const { data } = await useFetch<any>(`apissz/GetPost?id=${params.id}`, {
  baseURL: apiBase,
});
</script>

<template>
  <div class="page-container">
    <Head>
      <Title>{{ data?.data?.title }}</Title>
      <Meta name="description" :content="data?.data?.title" />
    </Head>
    <!-- Back button -->
    <article v-if="data">
      <button class="back-button" @click="$router.push('/')">
        <img width="100px" src="/images/arrow-back.png" />
        <span>Ко всем вакансиям</span>
      </button>
      <h1 v-html="htmlDecoding(data?.data?.title)"></h1>
      <div class="page-descr" v-html="htmlDecoding(data?.data?.content)"></div>
      <VacancyForm :vacation="htmlDecoding(data?.data?.title)" />
    </article>
  </div>
</template>

<style scoped>
.back-button {
  display: inline-flex;
  margin-bottom: 32px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  align-items: center;
  gap: 12px;
}
</style>
