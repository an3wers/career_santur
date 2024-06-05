<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";

/*

struct sVacantionFeedBack
{
    public string name { set; get; }
    public string city { set; get; }
    public string vacation { set; get; }

    public string phone { set; get; }
    public string info { set; get; }

    public string[] recievers { set; get; }

}

*/

const schema = yup.object({
  city: yup.string().required("Обязательное поле").trim(),
  name: yup.string().required("Обязательное поле").trim(),
  vacation: yup.string().required("Обязательное поле").trim(),
  phone: yup.string().required("Обязательное поле").trim(),
  checkboxPolitics: yup.boolean().oneOf([true]).required(),
});

const { defineField, errors, handleSubmit, isSubmitting } = useForm<{
  city: string;
  name: string;
  vacation: string;
  phone: string;
  checkboxPolitics: boolean;
}>({ validationSchema: schema, initialValues: { checkboxPolitics: true } });

const [city] = defineField("city", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});
const [name] = defineField("name", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});
const [vacation] = defineField("vacation", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});
const [phone] = defineField("phone", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});
const [checkboxPolitics] = defineField("checkboxPolitics", {
  validateOnModelUpdate: true,
  validateOnBlur: false,
});

const isSubmitted = ref(false);
const isErrorFormSubmit = ref<string | null>(null);

const formHandler = handleSubmit(async (values, { resetForm }) => {
  const { city, name, phone, vacation } = values;

  try {
    await $fetch("/api/contact-feedback", {
      method: "POST",
      body: {
        city,
        name,
        phone,
        vacation,
      },
    });
    resetForm();
    isSubmitted.value = true;
  } catch (error) {
    isErrorFormSubmit.value =
      error instanceof Error ? error.message : JSON.stringify(error);
  }
});

// const formHandler = async () => {
//   const url = useRuntimeConfig().public.apiBase; // "http://10.10.10.77:64439/";
//   const endpoint = "apissz/careerContactFeedback";
//   // const endpoint2 = "apissz/careerJobFeedback";

//   // const otherInfo =
//   //   "lorem ipsum dolor sit amet, consect commodo just sed, sed do eiusmod tempor incidid";

//   // const formData = new FormData();

//   // formData.append("city", city.value);
//   // formData.append("name", name.value);
//   // formData.append("phone", phone.value);
//   // formData.append("vacancy", vacancy.value);

//   // for (var pair of formData.entries()) {
//   //   console.log(pair[0] + " - " + pair[1]);
//   // }

//   // const data = {
//   //   name: "Артем", // name.value,
//   //   city: city.value,
//   //   vacation: "Девопс", // vacancy.value,
//   //   phone: "2700404", // phone.value,
//   //   info: otherInfo,
//   //   recievers: ["artemzh@santur.ru"],
//   // };

//   // const payload = {
//   //   city: city.value,
//   //   name: name.value,
//   //   vacation: vacancy.value,
//   //   phone: phone.value,
//   // };

//   // const res = await $fetch(url + endpoint2, {
//   //   method: "POST",
//   //   body: payload,
//   // });

//   // console.log(res);
// };
</script>

<template>
  <article>
    <div id="contacts" class="contacts__header-wrapper">
      <h2 class="contacts__header">СВЯЖИТЕСЬ С НАМИ</h2>
    </div>
    <div class="contacts">
      <p class="contacts-item">Алена:</p>
      <p class="contacts-item">
        <a href="tel:79826117900">+7 (982) 611-79-00</a>
      </p>
      <p class="contacts-item">
        <a href="mailto:kovalenko@santur.ru" target="_blank"
          >kovalenko@santur.ru</a
        >
      </p>
      <p class="contacts-item">Анастасия:</p>
      <p class="contacts-item">
        <a href="tel:79122133434">+7 (912) 213-34-34</a>
      </p>
      <p class="contacts-item">
        <a href="mailto:bond@santur.ru" target="_blank">bond@santur.ru</a>
      </p>
    </div>
    <div class="success-view" v-if="isSubmitted">
      <p class="text-success">Ваш запрос успешно отправлен.</p>
      <div class="success-view__btn-container">
        <button type="button" @click="isSubmitted = false" class="btn__submit">
          ОТПРАВИТЬ ЕЩЕ РАЗ
        </button>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="formHandler">
        <div class="forms__input">
          <div>
            <label for="city" class="visually-hidden">Поле город</label>
            <input
              v-model.trim="city"
              type="text"
              placeholder="Город"
              id="city"
              class="form__city form__input"
            />
            <small class="error-message" v-if="errors.city">{{
              errors.city
            }}</small>
          </div>
          <div>
            <label for="name" class="visually-hidden">Поле фио</label>
            <input
              v-model.trim="name"
              type="text"
              placeholder="ФИО"
              id="name"
              class="form__name form__input"
            />
            <small class="error-message" v-if="errors.name">{{
              errors.name
            }}</small>
          </div>
          <div>
            <label for="vacancy" class="visually-hidden"
              >Поле кем хотите работать</label
            >
            <input
              type="text"
              v-model.trim="vacation"
              placeholder="Кем хотите работать"
              id="vacancy"
              class="form__vacancy form__input"
            />
            <small class="error-message" v-if="errors.vacation">{{
              errors.vacation
            }}</small>
          </div>
          <div>
            <label for="phone" class="visually-hidden">Поле телефон</label>
            <input
              type="tel"
              v-model.trim="phone"
              placeholder="Телефон"
              id="phone"
              class="form__tel form__input"
            />
            <small class="error-message" v-if="errors.phone">{{
              errors.phone
            }}</small>
          </div>
        </div>
        <div class="checkboxes">
          <div class="checkboxes-item">
            <label for="allow__spam" class="agree-text">
              <input type="checkbox" id="allow__spam" class="checkbox" />
              Присылать оповещения о новых вакансиях
            </label>
            <label for="allow__personal-info" class="agree-text">
              <input
                type="checkbox"
                id="allow__personal-info"
                class="checkbox"
                required
                name="checkboxPolitics"
                v-model="checkboxPolitics"
              />
              <div>
                Соглашаюсь на обработку своих персональных данных в соответствии
                <NuxtLink
                  class="agree__link"
                  to="https://santur.ru/politika"
                  target="_blank"
                  >с политикой
                </NuxtLink>
              </div>
            </label>
          </div>
          <button type="submit" :disabled="isSubmitting" class="btn__submit">
            ОТПРАВИТЬ
          </button>
        </div>
      </form>
    </div>
  </article>
</template>

<style scoped>
.error-message {
  font-size: 12px;
  color: red;
}

.success-view {
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-success {
  font-size: var(--mainSize);
  color: rgb(10, 151, 46);
  text-align: center;
  font-weight: 600;
}

.success-view__btn-container {
  text-align: center;
}
</style>
