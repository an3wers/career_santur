<script setup lang="ts"></script>

<template>
  <header class="header">
    <div class="header__block">
      <div class="logo__svg">
        <NuxtLink to="/">
          <img
            class="logo__svg-img"
            src="/svg/header__logo.svg"
            alt="логотип компании"
          />
        </NuxtLink>
      </div>
      <nav class="navigation">
        <NuxtLink class="nav__link" to="/#goals">Ценности</NuxtLink>
        <NuxtLink class="nav__link" to="/#conditions">Условия</NuxtLink>
        <NuxtLink class="nav__link" to="/#vacancy">Вакансии</NuxtLink>
        <NuxtLink class="nav__link" to="/#contacts">Анкета</NuxtLink>
        <NuxtLink class="nav__link" to="/#contacts">Контакты</NuxtLink>
      </nav>
    </div>
    <img
      src="/svg/underline.svg"
      alt="декоративная полоса"
      class="decorated__underline"
    />
  </header>
</template>

<style scoped></style>
