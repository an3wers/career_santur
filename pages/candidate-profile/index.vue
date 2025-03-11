<script setup lang="ts">
import { useForm, FieldArray } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

definePageMeta({
  layout: "sb-form",
});

useHead({
  title: "Анкета кандидата",
  meta: [
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
});

const isChangedLastName = ref(false);
const isAddressSameRegistration = ref(true);
const hasCriminalRecord = ref(false);
const hasLegalEntityHead = ref(false);
const hasStateOfficialRelative = ref(false);
const applyPolicy = ref(false);

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
        .oneOf(
          ["холост", "не замужем", "женат", "замужем"],
          "Обязательное поле"
        ),
      children: yup.string().notRequired(),
      livingConditions: yup.string().required("Обязательное поле").trim(),
      email: yup
        .string()
        .email("Введите корректный email")
        .required("Обязательное поле")
        .trim(),
      phone: yup.string().required("Обязательное поле").trim(),
      militaryDetail: yup.string().notRequired(),
      criminalDetail: hasCriminalRecord.value
        ? yup.string().required("Обязательное поле").trim()
        : yup.string().notRequired(),
      hasDebts: yup.boolean(),
      legalEntityHeadDetail: hasLegalEntityHead.value
        ? yup.string().required("Обязательное поле").trim()
        : yup.string().notRequired(),
      stateOfficialDetail: hasStateOfficialRelative.value
        ? yup.string().required("Обязательное поле").trim()
        : yup.string().notRequired(),
      family: yup.array().of(
        yup.object({
          degreeOfKinship: yup.string().notRequired(),
          fullname: yup.string().notRequired(),
          jobtitle: yup.string().notRequired(),
          birthDate: yup.string().notRequired(),
          phone: yup.string().notRequired(),
        })
      ),
    })
  )
);

const { errors, defineField, handleSubmit, isSubmitting } = useForm({
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

const [criminalDetail] = defineField("criminalDetail");

// Задолженности по кредитам, алиментам, квартплате
const [hasDebts] = defineField("hasDebts");

const [legalEntityHeadDetail] = defineField("legalEntityHeadDetail"); // ИНН

const [stateOfficialDetail] = defineField("stateOfficialDetail");

const [family] = defineField("family");

const handleForm = handleSubmit(async (value, { resetForm }) => {
  console.log({ form: value });
  resetForm();
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="logo">
        <img src="~/assets/images/logo-santur.svg" alt="logo" />
      </div>
      <h1>Анкета кандидата</h1>
      <form class="form" @submit.prevent="handleForm">
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

          <div v-show="isChangedLastName" class="field">
            <span class="field__hint">Укажите прежнюю. Сколько раз?</span>
            <input
              id="previousLastNames"
              v-model="previousLastNames"
              type="text"
              name="previousLastNames"
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
            <label class="field__label" for="birthDate">Дата рождения</label>
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
            <label class="field__label" for="birthPlace">Место рождения</label>
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
          <label class="field__label" for="registrationAddress"
            >Адрес регистрации</label
          >
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
          <label class="field__label" for="address">Адрес проживания</label>
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
          <label class="field__label" for="maritalStatus"
            >Семейное положение</label
          >
          <select
            id="maritalStatus"
            v-model="maritalStatus"
            class="field__input"
            :class="{ error: errors.maritalStatus }"
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

        <div class="field">
          <label for="children" class="field__label">Дети, возраст детей</label>
          <input
            id="children"
            v-model="children"
            type="text"
            name="children"
            class="field__input"
            :class="{ error: errors.children }"
          />
          <div v-if="errors.children" class="field__error-text">
            {{ errors.children }}
          </div>
        </div>

        <div class="field">
          <label for="livingConditions" class="field__label"
            >Условия проживания</label
          >
          <span class="field__hint"
            >Собственное жилье, с родителями, снимаю, общежитие, другое
          </span>
          <input
            id="livingConditions"
            v-model="livingConditions"
            type="text"
            name="livingConditions"
            class="field__input"
            :class="{ error: errors.livingConditions }"
          />
          <div v-if="errors.livingConditions" class="field__error-text">
            {{ errors.livingConditions }}
          </div>
        </div>

        <div class="field-group-h">
          <div class="field">
            <label class="field__label" for="phone">Телефон</label>
            <input
              id="phone"
              v-model="phone"
              name="phone"
              type="tel"
              class="field__input"
              :class="{ error: errors.phone }"
            />
            <div v-if="errors.phone" class="field__error-text">
              {{ errors.phone }}
            </div>
          </div>
          <div class="field">
            <label class="field__label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              class="field__input"
              :class="{ error: errors.email }"
            />
            <div v-if="errors.email" class="field__error-text">
              {{ errors.email }}
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field__label" for="militaryDetail"
            >Воинская служба</label
          >
          <span class="field__hint">Служил/ не служил, № воинской части</span>
          <input
            id="militaryDetail"
            v-model="militaryDetail"
            type="text"
            name="militaryDetail"
            class="field__input"
            :class="{ error: errors.militaryDetail }"
          />
          <div v-if="errors.militaryDetail" class="field__error-text">
            {{ errors.militaryDetail }}
          </div>
        </div>

        <div class="field-group-v">
          <div class="field_checkbox">
            <input
              id="hasCriminalRecord"
              v-model="hasCriminalRecord"
              type="checkbox"
              name="hasCriminalRecord"
            />
            <label class="field__label" for="hasCriminalRecord"
              >Привлекались ли вы к уголовной ответственности?</label
            >
          </div>

          <div v-show="hasCriminalRecord" class="field">
            <span class="field__hint">Укажите по какой статье, когда?</span>
            <input
              id="criminalDetail"
              v-model="criminalDetail"
              type="text"
              name="criminalDetail"
              class="field__input"
              :class="{ error: errors.criminalDetail }"
            />
            <div v-if="errors.criminalDetail" class="field__error-text">
              {{ errors.criminalDetail }}
            </div>
          </div>
        </div>

        <div class="field_checkbox">
          <input
            id="hasDebts"
            v-model="hasDebts"
            type="checkbox"
            name="hasDebts"
          />
          <label class="field__label" for="hasDebts">
            Имеются ли у вас задолженности по кредитам, алиментам, квартплате?
          </label>
        </div>

        <div class="field-group-v">
          <div class="field_checkbox">
            <input
              id="hasLegalEntityHead"
              v-model="hasLegalEntityHead"
              type="checkbox"
              name="hasLegalEntityHead"
            />
            <label class="field__label" for="hasLegalEntityHead">
              Являетесь (являлись) ли вы руководителем (учредителем)
              юридического лица?
            </label>
          </div>
          <div v-show="hasLegalEntityHead" class="field w-1-3">
            <span class="field__hint">Укажите ИНН</span>
            <input
              id="legalEntityHeadDetail"
              v-model="legalEntityHeadDetail"
              type="text"
              name="legalEntityHeadDetail"
              class="field__input"
              :class="{ error: errors.legalEntityHeadDetail }"
            />
            <div v-if="errors.legalEntityHeadDetail" class="field__error-text">
              {{ errors.legalEntityHeadDetail }}
            </div>
          </div>
        </div>

        <div class="field-group-v">
          <div class="field_checkbox">
            <input
              id="hasStateOfficialRelative"
              v-model="hasStateOfficialRelative"
              type="checkbox"
              name="hasStateOfficialRelative"
            />
            <label class="field__label" for="hasStateOfficialRelative">
              Является ли кто-то из ваших близких родственником Государственным
              Должностным Лицом?
            </label>
          </div>
          <div v-show="hasStateOfficialRelative" class="field">
            <span class="field__hint"
              >Укажите ФИО, степень родства, должность</span
            >
            <input
              id="stateOfficialDetail"
              v-model="stateOfficialDetail"
              type="text"
              name="stateOfficialDetail"
              class="field__input"
              :class="{ error: errors.stateOfficialDetail }"
            />
            <div v-if="errors.stateOfficialDetail" class="field__error-text">
              {{ errors.stateOfficialDetail }}
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field__label" style="margin-bottom: 0.5rem"
            >Сведения о семье (ваши ближайшие родственники):</label
          >

          <FieldArray v-slot="{ fields, push, remove }" name="family">
            <div
              v-for="(field, idx) in fields"
              :key="field.key"
              class="field-group-v field-card"
            >
              <div class="field-group-h">
                <div class="field">
                  <label :for="`degreeOfKinship_${idx}`" class="field__label"
                    >Степень родства</label
                  >
                  <input
                    :id="`degreeOfKinship_${idx}`"
                    v-model="family![idx].degreeOfKinship"
                    :name="`degreeOfKinship_${idx}`"
                    class="field__input"
                  />
                </div>
                <div class="field">
                  <label :for="`fullname_${idx}`" class="field__label"
                    >ФИО</label
                  >
                  <input
                    :id="`fullname_${idx}`"
                    v-model="family![idx].fullname"
                    :name="`fullname_${idx}`"
                    class="field__input"
                  />
                </div>
              </div>

              <div class="field-group-h">
                <div class="field">
                  <label :for="`birthDate_${idx}`" class="field__label"
                    >Дата рождения</label
                  >
                  <input
                    :id="`birthDate_${idx}`"
                    v-model="family![idx].birthDate"
                    :name="`birthDate_${idx}`"
                    type="date"
                    class="field__input"
                  />
                </div>
                <div class="field">
                  <label :for="`phone_${idx}`" class="field__label"
                    >Телефон</label
                  >
                  <input
                    :id="`phone_${idx}`"
                    v-model="family![idx].phone"
                    :name="`phone_${idx}`"
                    type="tel"
                    class="field__input"
                  />
                </div>
              </div>

              <div class="field">
                <label :for="`jobtitle_${idx}`" class="field__label"
                  >Место работы и должность</label
                >
                <input
                  :id="`jobtitle_${idx}`"
                  v-model="family![idx].jobtitle"
                  :name="`jobtitle_${idx}`"
                  type="text"
                  class="field__input"
                />
              </div>
              <div v-if="idx !== 0">
                <button
                  type="button"
                  class="btn btn_sm btn_warning"
                  @click="remove(idx)"
                >
                  Удалить
                </button>
              </div>
            </div>
            <div>
              <button
                type="button"
                :disabled="Boolean(family!.length > 3)"
                class="btn btn_sm"
                @click="
                  push({
                    degreeOfKinship: '',
                    fullname: '',
                    jobtitle: '',
                    birthDate: '',
                    phone: '',
                  })
                "
              >
                Добавить
              </button>
            </div>
          </FieldArray>
        </div>

        <div class="field_checkbox">
          <input
            id="applyPolicy"
            v-model="applyPolicy"
            type="checkbox"
            name="applyPolicy"
          />
          <label class="field__label" for="applyPolicy">
            Я даю согласие на
            <nuxt-link to="#">обработку моих персональных данных</nuxt-link>.
          </label>
        </div>

        <div>
          <p v-show="Object.keys(errors).length > 0" class="form-error-text">
            Пожалуйста, проверьте корректность введенных данных
          </p>
          <button
            type="submit"
            :disabled="isSubmitting || !applyPolicy"
            class="btn"
          >
            Отправить
          </button>
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
  padding: 2rem 4rem 6rem 4rem;
  margin: 0 auto;
  background: #ffffff;
  min-height: 100dvh;
  box-shadow: 0px 0px 24px 4px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 0px 24px 4px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 24px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 240px;
  margin-bottom: 2rem;
}

.logo img {
  width: 100%;
}

h1 {
  margin-bottom: 1.25rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.field-card {
  padding: 1.5rem 1.5rem;
  border: 1px solid #e1dfdf;
  background-color: #f3f3f3;
  border-radius: 0.5rem;
}

.field__label {
  font-size: 0.9375rem;
}

.field__input {
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 1rem;
  border: 1px solid #acacac;
  border-radius: 0.25rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  max-height: 40px;
}

.field__input:focus {
  border-color: #0c83e4;
  box-shadow: 0 0 5px rgba(12, 131, 228, 0.5);
}

.field__input:invalid {
  font-size: 0.875rem;
  border-color: #ff4444;
}

.field__input.error {
  border-color: #ff4444;
}

.field__input.error:focus {
  box-shadow: 0 0 5px rgba(228, 12, 12, 0.5);
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

.form-error-text {
  font-size: 0.875rem;
  color: #ff4444;
  margin-bottom: 1rem;
}

.w-1-3 {
  width: 33.33%;
  flex-shrink: 0;
}

.btn {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1;
  color: #fff;
  background-color: #0c83e4;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn_sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
}

.btn:hover {
  background-color: #0168c8;
}

.btn:active {
  background-color: #0168c8;
  transform: scale(0.98);
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

.btn:disabled {
  background-color: #0c83e4;
  cursor: not-allowed;
  opacity: 0.65;
}

.btn_warning {
  background-color: #ff4444;
}

.btn_warning:hover {
  background-color: #ff1a1a;
}

.btn_warning:active {
  background-color: #ff1a1a;
  transform: scale(0.98);
}

.btn_warning:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.5);
}

.btn_warning:disabled {
  background-color: #ff4444;
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 640px) {
  .container {
    padding: 2rem 2rem 6rem 2rem;
  }

  .w-1-3 {
    width: 100%;
  }

  .field-group-h {
    flex-direction: column;
    justify-content: stretch;
  }

  .field-card {
    padding: 2rem 1rem;
  }
}
</style>
