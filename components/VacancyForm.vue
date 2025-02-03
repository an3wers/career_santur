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
    <div v-if="isSubmitted" class="success-view">
      <p class="text-success">Ваш запрос успешно отправлен.</p>
      <div class="success-view__btn-container">
        <button class="btn__submit" type="button" @click="isSubmitted = false">
          ОТПРАВИТЬ ЕЩЕ РАЗ
        </button>
      </div>
    </div>

    <form v-else @submit.prevent="formHandler">
      <div class="forms__input">
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
          <label for="phone" class="visually-hidden">Поле телефон</label>
          <input
            id="phone"
            v-model.trim="phone"
            type="tel"
            placeholder="Телефон"
            class="form__tel form__input"
          />
          <small v-if="errors.phone" class="error-message">{{
            errors.phone
          }}</small>
        </div>
        <div class="input-info">
          <label for="info" class="visually-hidden">Поле телефон</label>
          <textarea
            id="info"
            v-model.trim="info"
            rows="5"
            placeholder="Дополнительная информация"
            class="form__info form__input"
          />
          <small v-if="errors.info" class="error-message">{{
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
