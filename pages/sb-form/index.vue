<script setup lang="ts">
import { useForm, FieldArray } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

definePageMeta({
  layout: "sb-form",
});

const isChangedLastName = ref(false);
const isAddressSameRegistration = ref(true);
const isCriminal = ref(false);
const isLegalEntityHead = ref(false);

const schema = computed(() =>
  toTypedSchema(
    yup.object({
      vacancy: yup.string().required("Обязательное поле").trim(),
      fullname: yup.string().required("Обязательное поле").trim(),
      previousLastNames: isChangedLastName.value
        ? yup.string().required("Обязательное поле").trim()
        : yup.string().notRequired(),
      passportSerial: yup.string().required("Обязательное поле").trim(),
      passportRegisterDetail: yup.string().required("Обязательное поле").trim(),
      birthDate: yup.string().required("Обязательное поле").trim(),
      birthPlace: yup.string().required("Обязательное поле").trim(),
      registrationAddress: yup.string().required("Обязательное поле").trim(),
      address: isAddressSameRegistration.value
        ? yup.string().notRequired()
        : yup.string().required("Обязательное поле").trim(),
      maritalStatus: yup
        .string()
        .required("Обязательное поле")
        .oneOf(["холост", "не замужем", "женат", "замужем"]),
      children: yup.string(),
      livingConditions: yup.string().required("Обязательное поле").trim(),
      email: yup.string().email().required("Обязательное поле").trim(),
      phone: yup.string().required("Обязательное поле").trim(),
      militaryDetail: yup.string(),
      criminalDetail: isCriminal.value
        ? yup.string().required("Обязательное поле").trim()
        : yup.string().notRequired(),
      legalEntityHeadDeatil: isLegalEntityHead.value
        ? yup.string().required("Обязательное поле").trim()
        : yup.string().notRequired(),
      family: yup.array().of(
        yup.object({
          degreeOfKinship: yup.string().required("Обязательное поле").trim(),
          fullname: yup.string().required("Обязательное поле").trim(),
          jobtitle: yup.string().required("Обязательное поле").trim(),
          birthDate: yup.string().required("Обязательное поле").trim(),
          phone: yup.string().required("Обязательное поле").trim(),
        })
      ),
    })
  )
);

const { errors, values, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    family: [
      {
        degreeOfKinship: "",
        fullname: "",
        jobtitle: "",
        birthDate: "",
        phone: "",
      },
    ],
    maritalStatus: "",
  },
});

const [vacancy] = defineField("vacancy");
const [fullname] = defineField("fullname");

const [previousLastNames] = defineField("previousLastNames");

const [passportSerial] = defineField("passportSerial");
const [passportRegisterDetail] = defineField("passportRegisterDetail");

const [birthDate] = defineField("birthDate");
const [birthPlace] = defineField("birthPlace");

// Прописка
const [registrationAddress] = defineField("registrationAddress");

// Фактический адрес проживания
const [address] = defineField("address");

const [maritalStatus] = defineField("maritalStatus");

const [children] = defineField("children");

// Условия проживания
const [livingConditions] = defineField("livingConditions");

const [phone] = defineField("phone");
const [email] = defineField("email");

const [militaryDetail] = defineField("militaryDetail");

// const [checkboxCriminalStatus] = defineField("checkboxCriminalStatus");
const [criminalDetail] = defineField("criminalDetail");

// Задолженности по кредитам, алиментам, квартплате
const [checkboxHasDebts] = defineField("checkboxHasDebts");

const [legalEntityHeadDeatil] = defineField("legalEntityHeadDeatil"); // ИНН

const [checkboxPolitics] = defineField("checkboxPolitics");
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <h1>Анкета кандидата</h1>
      <form class="form">
        <div class="field">
          <label class="field__label" for="vacancy"
            >Интересующая вакансия</label
          >
          <input
            id="vacancy"
            v-model="vacancy"
            name="vacancy"
            type="text"
            class="field__input"
            :class="{ error: errors.vacancy }"
          />
          <div v-if="errors.vacancy" class="field__error-text">
            {{ errors.vacancy }}
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="fullname">ФИО</label>
          <input
            id="fullname"
            v-model="fullname"
            name="fullname"
            type="text"
            class="field__input"
            :class="{ error: errors.fullname }"
          />
          <div v-if="errors.fullname" class="field__error-text">
            {{ errors.fullname }}
          </div>
        </div>
        <div class="field-group-v">
          <div class="field_checkbox">
            <input
              id="isChangedLastName"
              v-model="isChangedLastName"
              type="checkbox"
              name="isChangedLastName"
            />
            <label class="field__label" for="isChangedLastName"
              >Меняли ли вы фамилию?</label
            >
          </div>
          <span class="field__hint"
            >Если да, укажите прежнюю. Сколько раз?</span
          >
          <div v-show="isChangedLastName" class="field">
            <input
              id="previousLastNames"
              v-model="previousLastNames"
              type="text"
              name="previousLastNames"
              placeholder="Прежняя фамилия"
              class="field__input"
              :class="{ error: errors.previousLastNames }"
            />
            <div v-if="errors.previousLastNames" class="field__error-text">
              {{ errors.previousLastNames }}
            </div>
          </div>
        </div>

        <div class="field w-1-3">
          <label class="field__label">Серия и номер паспорта</label>
          <input
            id="passportSerial"
            v-model="passportSerial"
            name="passportSerial"
            class="field__input"
            :class="{ error: errors.passportSerial }"
          />
          <div v-if="errors.passportSerial" class="field__error-text">
            {{ errors.passportSerial }}
          </div>
        </div>
        <div class="field">
          <label class="field__label">Паспорт выдан (когда, кем)</label>
          <input
            id="passportRegisterDetail"
            v-model="passportRegisterDetail"
            name="passportRegisterDetail"
            class="field__input"
            :class="{ error: errors.passportRegisterDetail }"
          />
          <div v-if="errors.passportRegisterDetail" class="field__error-text">
            {{ errors.passportRegisterDetail }}
          </div>
        </div>
        <div class="field-group-h">
          <div class="field w-1-3">
            <label for="birthDate">Дата рождения</label>
            <input
              id="birthDate"
              v-model="birthDate"
              name="birthDate"
              type="date"
              class="field__input"
              :class="{ error: errors.birthDate }"
            />
            <div v-if="errors.birthDate" class="field__error-text">
              {{ errors.birthDate }}
            </div>
          </div>
          <div class="field">
            <label for="birthPlace">Место рождения</label>
            <input
              id="birthPlace"
              v-model="birthPlace"
              name="birthPlace"
              type="text"
              class="field__input"
              :class="{ error: errors.birthPlace }"
            />
            <div v-if="errors.birthPlace" class="field__error-text">
              {{ errors.birthPlace }}
            </div>
          </div>
        </div>
        <div class="field">
          <label for="registrationAddress">Адрес регистрации</label>
          <input
            id="registrationAddress"
            v-model="registrationAddress"
            name="registrationAddress"
            type="text"
            class="field__input"
            :class="{ error: errors.registrationAddress }"
          />
          <div v-if="errors.registrationAddress" class="field__error-text">
            {{ errors.registrationAddress }}
          </div>
        </div>
        <div class="field_checkbox">
          <input
            id="isAddressSameRegistration"
            v-model="isAddressSameRegistration"
            type="checkbox"
            name="isAddressSameRegistration"
          />
          <label class="field__label" for="isAddressSameRegistration"
            >Адрес проживания совпадает с местом регистрации?</label
          >
        </div>
        <div v-show="!isAddressSameRegistration" class="field">
          <label for="address">Адрес проживания</label>
          <input
            id="address"
            v-model="address"
            name="address"
            type="text"
            class="field__input"
            :class="{ error: errors.address }"
          />
          <div v-if="errors.address" class="field__error-text">
            {{ errors.address }}
          </div>
        </div>
        <div class="field w-1-3">
          <label for="maritalStatus">Семейное положение</label>
          <select
            id="maritalStatus"
            v-model="maritalStatus"
            class="field__input"
          >
            <option disabled value="">Выберите вариант</option>
            <option>холост</option>
            <option>не замужем</option>
            <option>женат</option>
            <option>замужем</option>
          </select>
          <div v-if="errors.maritalStatus" class="field__error-text">
            {{ errors.maritalStatus }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: #f0efef;
  min-height: 100dvh;
  font-family: "OpenSansHebrew-Bold", sans-serif;
}

.container {
  max-width: 840px;
  padding: 2rem 4rem;
  margin: 0 auto;
  background: #ffffff;
  min-height: 100dvh;
}

h1 {
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group-h {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-between;
}

.field-group-v {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field_checkbox {
  display: inline-flex;
  gap: 0.25rem;
  align-items: baseline;
}

.field__label {
  font-size: 1rem;
}

.field__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #acacac;
  border-radius: 0.25rem;
  outline: none;
  transition: border-color 0.2s ease;
  max-height: 44px;
}

.field__input:focus {
  border-color: #363636;
}

.field__input:invalid {
  font-size: 0.875rem;
  border-color: #ff4444;
}

.field__input.error {
  border-color: #ff4444;
}

.field__input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.field__hint {
  font-size: 0.875rem;
  color: #525252;
}
.field__error-text {
  font-size: 0.875rem;
  color: #ff4444;
}

.w-1-3 {
  width: 33.33%;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .container {
    padding: 2rem 2rem;
  }

  .w-1-3 {
    width: 100%;
  }

  .field-group-h {
    flex-direction: column;
    justify-content: stretch;
  }
}
</style>
