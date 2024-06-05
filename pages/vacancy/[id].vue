<script setup lang="ts">
const { apiBase } = useRuntimeConfig().public;
const { params } = useRoute();

const { data } = await useFetch<any>(`apissz/GetPost?id=${params.id}`, {
  baseURL: apiBase,
});

// TODO: TO utils
const htmlDecoding = (string: string) => {
  let tmp = "";
  if (string) {
    tmp = string
      .replace(/\\\\r|\\\\n|\\\\t|\\n|\\t|\\r/g, "")
      .replace(/(&)?lt;/g, "<")
      .replace(/(&)?gt;/g, ">")
      .replace(/(&)?quot;/g, '"')
      .replace(/(&)?amp;/g, "")
      .replace(/(&)?nbsp;/g, "&nbsp;")
      .replace(/(&)?#171;/g, "«")
      .replace(/(&)?#187;/g, "»")
      .replace(/(&)?mdash;/g, "–")
      .replace(/(&)?laquo;/g, "«")
      .replace(/(&)?raquo;/g, "»")
      .replace(/(&)?bull;/g, "•")
      .replace(/(&)?ndash;/g, "–");
  }
  return tmp;
};
</script>

<template>
  <div class="page-container">
    <Head>
      <Title>{{ data?.data?.title }}</Title>
      <Meta name="description" :content="data?.data?.title" />
    </Head>
    <!-- Back button -->
    <article v-if="data">
      <button @click="$router.push('/')" class="back-button">
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
