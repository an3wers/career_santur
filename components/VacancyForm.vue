<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps<{ vacation: string }>();

const schema = yup.object({
  name: yup.string().required("Обязательное поле").trim(),
  phone: yup.string().required("Обязательное поле").trim(),
  info: yup
    .string()
    .min(80, "Поле должно содержать минимум 80 символов")
    .required("Обязательное поле")
    .trim(),
});

const { defineField, errors, handleSubmit, isSubmitting } = useForm<{
  name: string;
  phone: string;
  info: string;
}>({ validationSchema: schema });

const [name] = defineField("name", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});

const [phone] = defineField("phone", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});

const [info] = defineField("info", {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});

const isSubmitted = ref(false);
const isErrorFormSubmit = ref<string | null>(null);
const formHandler = handleSubmit(async (value, { resetForm }) => {
  const { info, name, phone } = value;

  try {
    await $fetch("/api/job-feedback", {
      method: "POST",
      body: {
        name,
        phone,
        info,
        vacation: props.vacation,
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
  <div>
    <div class="success-view" v-if="isSubmitted">
      <p class="text-success">Ваш запрос успешно отправлен.</p>
      <div class="success-view__btn-container">
        <button type="button" @click="isSubmitted = false" class="btn__submit">
          ОТПРАВИТЬ ЕЩЕ РАЗ
        </button>
      </div>
    </div>

    <form v-else @submit.prevent="formHandler">
      <div class="forms__input">
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
        <div class="input-info">
          <label for="info" class="visually-hidden">Поле телефон</label>
          <textarea
            v-model.trim="info"
            rows="5"
            placeholder="Дополнительная информация"
            id="info"
            class="form__info form__input"
          />
          <small class="error-message" v-if="errors.info">{{
            errors.info
          }}</small>
        </div>
      </div>
      <div class="btn-container">
        <button type="submit" :disabled="isSubmitting" class="btn__submit">
          ОТКЛИКНУТЬСЯ
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.error-message {
  font-size: 12px;
  color: red;
}

.input-info {
  grid-column: 1 / 3;
}

.btn-container {
  text-align: center;
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

@media (width < 850px) {
  .input-info {
    grid-column: 1 / 1;
  }
}
</style>
