<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Карьера в Сантехкомплект-Урал`
      : "Карьера в Сантехкомплект-Урал";
  },
  script: [
    {
      innerHTML() {
        return `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
           m[i].l=1*new Date();
           for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
           k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
           (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

           ym(99725795, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
         })
        `;
      },
      src: "",
      tagPosition: "bodyClose",
    },
  ],
  noscript: [
    {
      innerHTML: () =>
        `<div><img src="https://mc.yandex.ru/watch/99725795" alt="" /></div>`,
      tagPosition: "bodyClose",
    },
  ],
});

const nuxtApp = useNuxtApp();

nuxtApp.hook("page:finish", () => {
  if (window && "ym" in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.ym as any)(99725795, "hit", window.location.href);
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage :page-key="(route) => route.fullPath" />
  </NuxtLayout>
</template>
