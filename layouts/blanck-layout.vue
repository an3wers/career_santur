<script setup lang="ts"></script>

<template>
  <div class="container">
    <slot />
  </div>
</template>

<style>
.container {
  max-width: 1024px;
  padding: 1rem 2rem;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1em;
}
h2 {
  margin-bottom: 1em;
}
h3 {
  margin-bottom: 1em;
}

p {
  line-height: 1.5;
}

p + p {
  margin-top: 12px;
}

ul {
  list-style: disc;
  padding-left: 24px;
  margin: 16px 0;
}

ul li + li {
  margin-top: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 16px;
  min-width: 400px;
}

table thead tr {
  text-align: left;
}

table th,
table td {
  padding: 12px 15px;
}

table tbody tr {
  border-bottom: 1px solid #dddddd;
}

@media (max-width: 600px) {
  table {
    display: block;
    overflow-x: auto;
  }
}
</style>
