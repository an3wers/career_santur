<script setup lang="ts">
import { useForm, FieldArray } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";
import HoneypotInput from "~/components/HoneypotInput.vue";

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

const honeyRef = useTemplateRef<typeof HoneypotInput>("honeyInput");

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
      city: yup.string().required("Обязательное поле").trim(),
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

const { errors, defineField, values, handleSubmit, isSubmitting } = useForm({
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
    city: "Екатеринбург",
  },
});

type FormValues = typeof values;

const [vacancy] = defineField("vacancy");

const [city] = defineField("city");

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

const submitStatus = ref<"idle" | "pending" | "success" | "error">("idle");

const hasFieldsErrors = computed(() => Object.keys(errors.value).length > 0);

const { apiCandidate } = useRuntimeConfig().public;

const handleForm = handleSubmit(async (value, { resetForm }) => {
  try {
    if (honeyRef.value && honeyRef.value.isSpam()) {
      throw new Error("Request Error");
    }

    submitStatus.value = "pending";

    const response = await $fetch<{
      data: unknown;
      success: boolean;
      message: string;
    }>(`${apiCandidate}apiVacancy/StoreAnkt`, {
      method: "POST",
      body: createFormJson(value),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response?.success) {
      submitStatus.value = "error";
    }

    submitStatus.value = "success";
    resetForm();
  } catch (error) {
    console.error(error);
    submitStatus.value = "error";
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createFormData(rawValues: FormValues) {
  const { family, ...other } = rawValues;
  const formData = new FormData();

  Object.entries(other).forEach(([k, v]) => {
    formData.append(k, v?.toString() ?? "");
  });

  family?.forEach((el) => {
    formData.append("family", JSON.stringify(el));
  });

  formData.append(
    "isChangedLastName",
    isChangedLastName.value ? "true" : "false"
  );

  formData.append(
    "isAddressSameRegistration",
    isAddressSameRegistration.value ? "true" : "false"
  );

  formData.append(
    "hasCriminalRecord",
    hasCriminalRecord.value ? "true" : "false"
  );

  formData.append(
    "hasLegalEntityHead",
    hasLegalEntityHead.value ? "true" : "false"
  );

  formData.append(
    "hasStateOfficialRelative",
    hasStateOfficialRelative.value ? "true" : "false"
  );

  return formData;
}

function createFormJson(rawValues: FormValues) {
  const values = rawValues;

  checkInputFlag();
  removeEmptyFamilyFields();

  function removeEmptyFamilyFields() {
    if (!values.family) {
      values.family = [];
    }

    values.family = values.family.filter((el) => {
      return (
        el.degreeOfKinship !== "" ||
        el.fullname !== "" ||
        el.jobtitle !== "" ||
        el.birthDate !== "" ||
        el.phone !== ""
      );
    });
  }

  function checkInputFlag() {
    if (
      !values.previousLastNames ||
      (!isChangedLastName.value && values.previousLastNames !== "")
    ) {
      values.previousLastNames = "";
    }

    if (
      !values.address ||
      (isAddressSameRegistration.value && values.registrationAddress !== "")
    ) {
      values.address = values.registrationAddress;
    }

    if (
      !values.criminalDetail ||
      (!hasCriminalRecord.value && values.criminalDetail !== "")
    ) {
      values.criminalDetail = "";
    }

    if (
      !values.legalEntityHeadDetail ||
      (!hasLegalEntityHead.value && values.legalEntityHeadDetail !== "")
    ) {
      values.legalEntityHeadDetail = "";
    }

    if (
      !values.stateOfficialDetail ||
      (!hasStateOfficialRelative.value && values.stateOfficialDetail !== "")
    ) {
      values.stateOfficialDetail = "";
    }
  }

  return {
    ...values,
    isChangedLastName: isChangedLastName.value,
    isAddressSameRegistration: isAddressSameRegistration.value,
    hasCriminalRecord: hasCriminalRecord.value,
    hasLegalEntityHead: hasLegalEntityHead.value,
    hasStateOfficialRelative: hasStateOfficialRelative.value,
  };
}
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="logo">
        <img src="~/assets/images/logo-santur.svg" alt="logo" />
      </div>
      <h1>Анкета кандидата</h1>
      <div v-if="submitStatus === 'success'" class="success-message">
        <i class="success-message__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34m-1.293 5.953a1 1 0 0 0-1.32-.083l-.094.083L11 12.585l-1.293-1.292l-.094-.083a1 1 0 0 0-1.403 1.403l.083.094l2 2l.094.083a1 1 0 0 0 1.226 0l.094-.083l4-4l.083-.094a1 1 0 0 0-.083-1.32"
            />
          </svg>
        </i>
        <p>Спасибо, анкета успешно отправлена!</p>
      </div>
      <template v-if="submitStatus !== 'success'">
        <form class="form" @submit.prevent="handleForm">
          <div class="field-group-h">
            <div class="field field_required">
              <label class="field__label" for="vacancy"
                >Интересующая вакансия</label
              >
              <input
                id="vacancy"
                v-model.trim="vacancy"
                name="vacancy"
                type="text"
                class="field__input"
                :class="{ error: errors.vacancy }"
                :disabled="isSubmitting"
              />
              <div v-if="errors.vacancy" class="field__error-text">
                {{ errors.vacancy }}
              </div>
            </div>

            <div class="field field_required w-1-3 shrink-0">
              <label class="field__label" for="city"
                >В каком городе вакансия?</label
              >
              <select
                id="city"
                v-model.trim="city"
                class="field__input"
                :class="{ error: errors.city }"
                :disabled="isSubmitting"
              >
                <option value="Екатеринбург">Екатеринбург</option>
                <option value="Нижний Тагил">Нижний Тагил</option>
                <option value="Пермь">Пермь</option>
              </select>
              <div v-if="errors.city" class="field__error-text">
                {{ errors.city }}
              </div>
            </div>
          </div>

          <!--  -->
          <HoneypotInput ref="honeyInput" name="fax-number" />
          <div class="field field_required">
            <label class="field__label" for="fullname">ФИО</label>
            <input
              id="fullname"
              v-model.trim="fullname"
              name="fullname"
              type="text"
              class="field__input"
              :class="{ error: errors.fullname }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.fullname" class="field__error-text">
              {{ errors.fullname }}
            </div>
          </div>
          <div class="field-group-v">
            <div class="field_checkbox">
              <input
                id="isChangedLastName"
                v-model.trim="isChangedLastName"
                type="checkbox"
                name="isChangedLastName"
                :disabled="isSubmitting"
              />
              <label class="field__label" for="isChangedLastName"
                >Меняли ли вы фамилию?</label
              >
            </div>

            <div v-show="isChangedLastName" class="field">
              <span class="field__hint"
                >Если несколько раз, перечислите через запятую все предыдущие
                фамилии.</span
              >
              <input
                id="previousLastNames"
                v-model.trim="previousLastNames"
                type="text"
                name="previousLastNames"
                class="field__input"
                :class="{ error: errors.previousLastNames }"
                :disabled="isSubmitting"
              />
              <div v-if="errors.previousLastNames" class="field__error-text">
                {{ errors.previousLastNames }}
              </div>
            </div>
          </div>

          <div class="field field_required w-1-3">
            <label class="field__label">Серия и номер паспорта</label>
            <span class="field__hint">Формат: 4444 333333</span>
            <input
              id="passportSerial"
              v-model.trim="passportSerial"
              type="text"
              name="passportSerial"
              class="field__input"
              :class="{ error: errors.passportSerial }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.passportSerial" class="field__error-text">
              {{ errors.passportSerial }}
            </div>
          </div>
          <div class="field field_required">
            <label class="field__label">Паспорт выдан (когда, кем)</label>
            <input
              id="passportRegisterDetail"
              v-model.trim="passportRegisterDetail"
              name="passportRegisterDetail"
              class="field__input"
              :class="{ error: errors.passportRegisterDetail }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.passportRegisterDetail" class="field__error-text">
              {{ errors.passportRegisterDetail }}
            </div>
          </div>
          <div class="field-group-h">
            <div class="field field_required w-1-3">
              <label class="field__label" for="birthDate">Дата рождения</label>
              <input
                id="birthDate"
                v-model.trim="birthDate"
                name="birthDate"
                type="date"
                class="field__input"
                :class="{ error: errors.birthDate }"
                :disabled="isSubmitting"
              />
              <div v-if="errors.birthDate" class="field__error-text">
                {{ errors.birthDate }}
              </div>
            </div>
            <div class="field field_required">
              <label class="field__label" for="birthPlace"
                >Место рождения</label
              >
              <input
                id="birthPlace"
                v-model.trim="birthPlace"
                name="birthPlace"
                type="text"
                class="field__input"
                :class="{ error: errors.birthPlace }"
                :disabled="isSubmitting"
              />
              <div v-if="errors.birthPlace" class="field__error-text">
                {{ errors.birthPlace }}
              </div>
            </div>
          </div>
          <div class="field field_required">
            <label class="field__label" for="registrationAddress"
              >Адрес регистрации</label
            >
            <input
              id="registrationAddress"
              v-model.trim="registrationAddress"
              name="registrationAddress"
              type="text"
              class="field__input"
              :class="{ error: errors.registrationAddress }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.registrationAddress" class="field__error-text">
              {{ errors.registrationAddress }}
            </div>
          </div>
          <div class="field_checkbox">
            <input
              id="isAddressSameRegistration"
              v-model.trim="isAddressSameRegistration"
              type="checkbox"
              name="isAddressSameRegistration"
              :disabled="isSubmitting"
            />
            <label class="field__label" for="isAddressSameRegistration"
              >Адрес проживания совпадает с местом регистрации?</label
            >
          </div>
          <div v-show="!isAddressSameRegistration" class="field field_required">
            <label class="field__label" for="address">Адрес проживания</label>
            <input
              id="address"
              v-model.trim="address"
              name="address"
              type="text"
              class="field__input"
              :class="{ error: errors.address }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.address" class="field__error-text">
              {{ errors.address }}
            </div>
          </div>
          <div class="field field_required w-1-3">
            <label class="field__label" for="maritalStatus"
              >Семейное положение</label
            >
            <select
              id="maritalStatus"
              v-model.trim="maritalStatus"
              class="field__input"
              :class="{ error: errors.maritalStatus }"
              :disabled="isSubmitting"
            >
              <option disabled value="">Выберите вариант</option>
              <option value="холост">холост</option>
              <option value="не замужем">не замужем</option>
              <option value="женат">женат</option>
              <option value="замужем">замужем</option>
            </select>
            <div v-if="errors.maritalStatus" class="field__error-text">
              {{ errors.maritalStatus }}
            </div>
          </div>

          <div class="field">
            <label for="children" class="field__label"
              >Дети, возраст детей</label
            >
            <input
              id="children"
              v-model.trim="children"
              type="text"
              name="children"
              class="field__input"
              :class="{ error: errors.children }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.children" class="field__error-text">
              {{ errors.children }}
            </div>
          </div>

          <div class="field field_required">
            <label for="livingConditions" class="field__label"
              >Условия проживания</label
            >
            <span class="field__hint"
              >Собственное жилье, с родителями, снимаю, общежитие, другое
            </span>
            <input
              id="livingConditions"
              v-model.trim="livingConditions"
              type="text"
              name="livingConditions"
              class="field__input"
              :class="{ error: errors.livingConditions }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.livingConditions" class="field__error-text">
              {{ errors.livingConditions }}
            </div>
          </div>

          <div class="field-group-h">
            <div class="field field_required">
              <label class="field__label" for="phone">Телефон</label>
              <input
                id="phone"
                v-model.trim="phone"
                v-maska="'+7 (###) ###-##-##'"
                placeholder="+7 (___) ___-__-__"
                name="phone"
                type="tel"
                class="field__input"
                :class="{ error: errors.phone }"
                :disabled="isSubmitting"
              />
              <div v-if="errors.phone" class="field__error-text">
                {{ errors.phone }}
              </div>
            </div>
            <div class="field field_required">
              <label class="field__label" for="email">Email</label>
              <input
                id="email"
                v-model.trim="email"
                name="email"
                type="email"
                class="field__input"
                :class="{ error: errors.email }"
                :disabled="isSubmitting"
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
              v-model.trim="militaryDetail"
              type="text"
              name="militaryDetail"
              class="field__input"
              :class="{ error: errors.militaryDetail }"
              :disabled="isSubmitting"
            />
            <div v-if="errors.militaryDetail" class="field__error-text">
              {{ errors.militaryDetail }}
            </div>
          </div>

          <div class="field-group-v">
            <div class="field_checkbox">
              <input
                id="hasCriminalRecord"
                v-model.trim="hasCriminalRecord"
                type="checkbox"
                name="hasCriminalRecord"
                :disabled="isSubmitting"
              />
              <label class="field__label" for="hasCriminalRecord"
                >Привлекались ли вы к уголовной ответственности?</label
              >
            </div>

            <div v-show="hasCriminalRecord" class="field">
              <span class="field__hint">Укажите по какой статье, когда?</span>
              <input
                id="criminalDetail"
                v-model.trim="criminalDetail"
                type="text"
                name="criminalDetail"
                class="field__input"
                :class="{ error: errors.criminalDetail }"
                :disabled="isSubmitting"
              />
              <div v-if="errors.criminalDetail" class="field__error-text">
                {{ errors.criminalDetail }}
              </div>
            </div>
          </div>

          <div class="field_checkbox">
            <input
              id="hasDebts"
              v-model.trim="hasDebts"
              type="checkbox"
              name="hasDebts"
              :disabled="isSubmitting"
            />
            <label class="field__label" for="hasDebts">
              Имеются ли у вас задолженности по кредитам, алиментам, квартплате?
            </label>
          </div>

          <div class="field-group-v">
            <div class="field_checkbox">
              <input
                id="hasLegalEntityHead"
                v-model.trim="hasLegalEntityHead"
                type="checkbox"
                name="hasLegalEntityHead"
                :disabled="isSubmitting"
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
                v-model.trim="legalEntityHeadDetail"
                type="number"
                name="legalEntityHeadDetail"
                class="field__input"
                :class="{ error: errors.legalEntityHeadDetail }"
                :disabled="isSubmitting"
              />
              <div
                v-if="errors.legalEntityHeadDetail"
                class="field__error-text"
              >
                {{ errors.legalEntityHeadDetail }}
              </div>
            </div>
          </div>

          <div class="field-group-v">
            <div class="field_checkbox">
              <input
                id="hasStateOfficialRelative"
                v-model.trim="hasStateOfficialRelative"
                type="checkbox"
                name="hasStateOfficialRelative"
                :disabled="isSubmitting"
              />
              <label class="field__label" for="hasStateOfficialRelative">
                Является ли кто-то из ваших близких родственником
                Государственным Должностным Лицом?
              </label>
            </div>
            <div v-show="hasStateOfficialRelative" class="field">
              <span class="field__hint"
                >Укажите ФИО, степень родства, должность</span
              >
              <input
                id="stateOfficialDetail"
                v-model.trim="stateOfficialDetail"
                type="text"
                name="stateOfficialDetail"
                class="field__input"
                :class="{ error: errors.stateOfficialDetail }"
                :disabled="isSubmitting"
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
                      v-model.trim="family![idx].degreeOfKinship"
                      :name="`degreeOfKinship_${idx}`"
                      class="field__input"
                      :disabled="isSubmitting"
                    />
                  </div>
                  <div class="field">
                    <label :for="`fullname_${idx}`" class="field__label"
                      >ФИО</label
                    >
                    <input
                      :id="`fullname_${idx}`"
                      v-model.trim="family![idx].fullname"
                      :name="`fullname_${idx}`"
                      class="field__input"
                      :disabled="isSubmitting"
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
                      v-model.trim="family![idx].birthDate"
                      :name="`birthDate_${idx}`"
                      type="date"
                      class="field__input"
                      :disabled="isSubmitting"
                    />
                  </div>
                  <div class="field">
                    <label :for="`phone_${idx}`" class="field__label"
                      >Телефон</label
                    >
                    <input
                      :id="`phone_${idx}`"
                      v-model.trim="family![idx].phone"
                      :name="`phone_${idx}`"
                      type="tel"
                      class="field__input"
                      :disabled="isSubmitting"
                    />
                  </div>
                </div>

                <div class="field">
                  <label :for="`jobtitle_${idx}`" class="field__label"
                    >Место работы и должность</label
                  >
                  <input
                    :id="`jobtitle_${idx}`"
                    v-model.trim="family![idx].jobtitle"
                    :name="`jobtitle_${idx}`"
                    type="text"
                    class="field__input"
                    :disabled="isSubmitting"
                  />
                </div>
                <div v-if="idx !== 0">
                  <button
                    type="button"
                    class="btn btn_sm btn_warning"
                    :disabled="isSubmitting"
                    @click="remove(idx)"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  :disabled="Boolean(family!.length > 3) || isSubmitting"
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
              v-model.trim="applyPolicy"
              type="checkbox"
              name="applyPolicy"
              :disabled="isSubmitting"
            />
            <label class="field__label" for="applyPolicy">
              Я даю согласие на
              <nuxt-link
                target="_blank"
                to="https://santur.ru/personal-information"
                >обработку моих персональных</nuxt-link
              >
              данных. С
              <nuxt-link target="_blank" to="https://santur.ru/politika"
                >Положением в отношении обработки персональных данных</nuxt-link
              >
              ознакомлен(-а).
            </label>
          </div>
          <div
            v-show="hasFieldsErrors || submitStatus === 'error'"
            class="error-message"
          >
            <i class="error-message__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 1.67c.955 0 1.845.467 2.39 1.247l.105.16l8.114 13.548a2.914 2.914 0 0 1-2.307 4.363l-.195.008H3.882a2.914 2.914 0 0 1-2.582-4.2l.099-.185l8.11-13.538A2.91 2.91 0 0 1 12 1.67M12.01 15l-.127.007a1 1 0 0 0 0 1.986L12 17l.127-.007a1 1 0 0 0 0-1.986zM12 8a1 1 0 0 0-.993.883L11 9v4l.007.117a1 1 0 0 0 1.986 0L13 13V9l-.007-.117A1 1 0 0 0 12 8"
                />
              </svg>
            </i>
            <p v-if="hasFieldsErrors">
              Пожалуйста, проверьте корректность введенных данных.
            </p>
            <p v-else>
              При отправки анкеты произошла ошибка, попробуйте еще раз.
            </p>
          </div>
          <div>
            <button
              type="submit"
              :disabled="isSubmitting || !applyPolicy"
              class="btn"
            >
              Отправить
              <span v-if="isSubmitting" class="spinner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3a9 9 0 1 0 9 9"
                  />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </template>
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

.field_required label::after {
  content: "*";
  color: #ff4444;
  margin-left: 2px;
}

.field_checkbox {
  display: inline-flex;
  gap: 0.25rem;
  align-items: baseline;
}

.field-card {
  padding: 1.5rem 1.5rem;
  background-color: #eef3f8;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.error-message {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 1rem 1rem;
  background-color: rgba(201, 0, 0, 0.14);
}

.error-message__icon {
  color: #ff4444;
}

.success-message {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 1rem 1rem;
  background-color: rgba(0, 201, 81, 0.18);
}

.success-message__icon {
  color: #00c951;
}

.w-1-3 {
  width: 33.33%;
  flex-shrink: 0;
  min-width: 200px;
}

.shrink-0 {
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

.spinner {
  width: 18px;
  height: 18px;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
    padding: 1.5rem 1rem;
  }
}
</style>
