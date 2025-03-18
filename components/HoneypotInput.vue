<script setup lang="ts">
const { name } = defineProps<{
  name: string;
}>();

const ohnofieldInput = ref();
const value = ref("");

function isSpam() {
  return value.value.trim().length > 0;
}

function reset() {
  value.value = "";
}

defineExpose({ isSpam, reset });
</script>

<template>
  <input
    :id="name"
    ref="ohnofieldInput"
    v-model="value"
    class="ohnofield"
    autocomplete="off"
    type="text"
    :name="name"
    :placeholder="`Your ${name}`"
    aria-hidden="true"
    tabindex="-1"
  />
</template>

<style scoped>
.ohnofield {
  opacity: 0;
  position: absolute;
  left: -8000px;
  z-index: -1;
}
</style>
