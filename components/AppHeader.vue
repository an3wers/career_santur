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
        <a class="nav__link" href="/#goals">Ценности</a>
        <a class="nav__link" href="/#conditions">Условия</a>
        <a class="nav__link" href="/#vacancy">Вакансии</a>
        <a class="nav__link" href="/#contacts">Анкета</a>
        <a class="nav__link" href="/#contacts">Контакты</a>
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
