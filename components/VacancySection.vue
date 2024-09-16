<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const CAT_ID = 28;
const PAGE = 1;
const LIMIT_CONST = 3;
const { apiBase } = useRuntimeConfig().public;
const { data } = await useFetch<Record<string, any>>("apissz/GetPosts", {
  baseURL: apiBase,
  query: { page: PAGE, categoryId: CAT_ID, app: "santur" },
});

const currentCity = ref<"ekb" | "tagil">("ekb");
const limit = ref(LIMIT_CONST);

const currentCityTransform = computed(() => {
  return currentCity.value === "ekb" ? "Екатеринбург" : "Нижний Тагил";
});

const filteredByCity = computed(() => {
  const resItems: any[] | undefined = [];

  if (data.value && data.value?.data?.items?.length > 0) {
    data.value.data.items.forEach((item: any) => {
      const foundFieldCity = item.extFields.find(
        (f: any) => f.title === "Город"
      );

      if (foundFieldCity.value === currentCityTransform.value) {
        resItems.push(item);
      }
    });
  }

  return resItems;
});

const limitedData = computed(() => {
  return filteredByCity.value.filter(
    (_: unknown, index: number) => index <= limit.value
  );
});

function toggleAll() {
  if (limit.value === data.value?.data?.items?.length) {
    limit.value = LIMIT_CONST;
  } else {
    limit.value = data.value?.data?.items?.length;
  }
}
</script>

<template>
  <article class="vacancy">
    <div id="vacancy" class="vacancy__header-wraper">
      <h2 class="vacancy__header">ВАКАНСИИ</h2>
    </div>
    <div class="maps">
      <div class="maps__img">
        <button @click="currentCity = 'ekb'" class="maps__btn">
          <h2 class="maps__header">ЕКАТЕРИНБУРГ</h2>
        </button>
        <img
          style="cursor: pointer"
          :src="
            currentCity === 'ekb'
              ? '/images/ekb.svg'
              : '/images/ekb_disable.svg'
          "
          alt="карта Екатеринбурга"
          class="ekb__map"
          @click="currentCity = 'ekb'"
        />
      </div>
      <div class="maps__img">
        <button class="maps__btn" @click="currentCity = 'tagil'">
          <h2 class="maps__header">НИЖНИЙ ТАГИЛ</h2>
        </button>
        <img
          style="cursor: pointer"
          :src="
            currentCity === 'tagil'
              ? '/images/tag.svg'
              : '/images/tag_disable.svg'
          "
          alt="карта Тагила"
          class="tag__map"
          @click="currentCity = 'tagil'"
        />
      </div>
    </div>
    <div class="list-container">
      <ul class="vac-list">
        <li v-for="item in limitedData" :key="item.id" class="vac-item">
          <NuxtLink :to="`/vacancy/${item.id}`">{{ item.title }}</NuxtLink>
          <img class="vac-logo" :src="'/images/vac_ekb.png'" />
        </li>
      </ul>
      <div v-if="limitedData.length > LIMIT_CONST" class="btn-container">
        <button class="btn__submit" @click="toggleAll">
          {{ limit === LIMIT_CONST ? "Показать больше вакансий" : "Скрыть" }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.maps__btn {
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;
}

.list-container {
  max-width: 960px;
  margin: 60px auto 0;
  padding: 0 20px;
}

.vac-list li + li {
  margin-top: 40px;
}

.vac-item {
  display: flex;
  gap: 16px;
  font-size: var(--mainSize);
  color: #254776;
  font-weight: 700;
}

.vac-item > a {
  text-decoration: none;
  flex-grow: 1;
}

.vac-logo {
  width: 100px;
}

.btn-container {
  text-align: center;
}
</style>
