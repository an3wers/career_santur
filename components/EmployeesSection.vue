<script setup lang="ts">

const employeCards = [
  {
    link: "https://sun9-21.userapi.com/impf/c628831/v628831177/49dfc/_npAnS8tYLM.jpg?size=960x720&quality=96&sign=8d71f22222d4562e330db7bc8fcb0d8e&type=album",
    cardHeader: "Мамаев Евгений",
    text: "Это тестовая карточка номер 2",
  },
  {
    link: "https://img.freepik.com/premium-photo/full-length-man-running-beach_1048944-16644661.jpg?w=1380",
    cardHeader: "Третий",
    text: "Это тестовая карточка номер 3",
  },
  {
    link: "https://img.freepik.com/free-photo/medium-shot-woman-wearing-headphones_23-2149818230.jpg?t=st=1718092522~exp=1718096122~hmac=2f4ceab587c2d6d168517f129becf324caf3fbb90047830b766815a7bb875138&w=1380",
    cardHeader: "Четвертый",
    text: "Это тестовая карточка номер 4",
  },
  {
    link: "https://img.freepik.com/premium-photo/woman-standing-by-potted-plants_1048944-16402036.jpg?w=1380",
    cardHeader: "Пятый",
    text: "Это тестовая карточка номер 5",
  },
]

onMounted(() => {
  async function changeCards() {
  for(let n: number=0; n < 4; n++) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    let img = document.querySelector(".img__employee");
    let header = document.querySelector(".card__employee-header")
    let cardText1 = document.getElementById("first_text")
    let cardText2 = document.getElementById("second_text")
    img.setAttribute("src", employeCards[n].link);
    header.innerHTML= employeCards[n].cardHeader;
    cardText1.innerHTML= employeCards[n].text;
    cardText2.innerHTML= employeCards[n].text;
    
  }
}
  
changeCards()

 });


</script>

<template>
  <article class="employees">
    <div class="header__employees-wraper">
      <h2 class="header__employees">НАШИ СОТРУДНИКИ</h2>
    </div>
    <div class="card__employee">
      <div class="card__employee-foto">
        <img src="/images/employe.png" alt="" class="img__employee" />
      </div>
      <div class="card__employee-item">
        <h4 class="card__employee-header">Рыжикова Ксения,</h4>
        <p class="card__employee-text" id="first_text">
          Руководитель отдела <br />
          «Проектные продажи»
        </p>
        <p class="card__employee-text" id="second_text">
          любитель гор, походов,<br />
          активного отдыха
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped></style>
