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
  email: yup.string().email().required("Обязательное поле").trim(),
  checkboxPolitics: yup.boolean().oneOf([true]).required(),
});

const { defineField, errors, handleSubmit, isSubmitting } = useForm<{
  city: string;
  name: string;
  vacation: string;
  phone: string;
  email: string;
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
const [email] = defineField("email", {
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
  const { city, name, phone, vacation, email } = values;

  try {
    await $fetch("/api/contact-feedback", {
      method: "POST",
      body: {
        city,
        name,
        phone,
        vacation,
        email,
      },
    });
    resetForm();
    isSubmitted.value = true;
  } catch (error) {
    isErrorFormSubmit.value =
      error instanceof Error ? error.message : JSON.stringify(error);
  }
});
</script>

<template>
  <article>
    <div id="contacts" class="contacts__header-wrapper">
      <h2 class="contacts__header">СВЯЖИТЕСЬ С НАМИ</h2>
    </div>
    <div class="contacts">
      <div class="contacts-item">
        <nuxt-link to="tel:79827601655">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
            />
          </svg>
        </nuxt-link>
      </div>
      <div class="contacts-item">
        <nuxt-link
          target="_blank"
          to="https://api.whatsapp.com/send/?phone=79827601655"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="m3 21l1.65-3.8a9 9 0 1 1 3.4 2.9z" />
              <path
                d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0za5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"
              />
            </g>
          </svg>
        </nuxt-link>
      </div>
      <div class="contacts-item">
        <nuxt-link target="_blank" to="https://t.me/+79827601655">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4"
            />
          </svg>
        </nuxt-link>
      </div>
      <!-- <p class="contacts-item">Вероника:</p>
      <p class="contacts-item">
        <a href="tel:73432700404">+7 (343) 270-04-04</a><br />
        <span class="text-cuption">(доб. 5151)</span>
      </p>
      <p class="contacts-item">
        <a href="mailto:chvv@santur.ru" target="_blank">chvv@santur.ru</a>
      </p> -->
    </div>
    <div v-if="isSubmitted" class="success-view">
      <p class="text-success">Ваш запрос успешно отправлен.</p>
      <div class="success-view__btn-container">
        <button type="button" class="btn__submit" @click="isSubmitted = false">
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
              id="city"
              v-model.trim="city"
              type="text"
              placeholder="Город"
              class="form__city form__input"
            />
            <small v-if="errors.city" class="error-message">{{
              errors.city
            }}</small>
          </div>
          <div>
            <label for="name" class="visually-hidden">Поле фио</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              placeholder="ФИО"
              class="form__name form__input"
            />
            <small v-if="errors.name" class="error-message">{{
              errors.name
            }}</small>
          </div>
          <div>
            <label for="email" class="visually-hidden">Поле email</label>
            <input type="email" v-model.trim="email" placeholder="Эл. почта""
            id="email" class="form__tel form__input" />
            <small class="error-message" v-if="errors.email">{{
              errors.email
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
          <div class="input-vacancy">
            <label for="vacancy" class="visually-hidden"
              >Поле кем хотите работать</label
            >
            <input
              id="vacancy"
              type="text"
              v-model.trim="vacation"
              placeholder="Желаемая должность"
              class="form__vacancy form__input"
            />
            <small class="error-message" v-if="errors.vacation">{{
              errors.vacation
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

.text-cuption {
  font-size: 0.75em;
}

.success-view__btn-container {
  text-align: center;
}

.input-vacancy {
  grid-column: span 2;
}
</style>
