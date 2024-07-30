export default defineEventHandler(async (event) => {
  const errorMessage = "При отправки формы произошла ошибка";
  const body = await readBody(event);
  const recievers = ["chvv@santur.ru"];

  try {
    const { apiBase } = useRuntimeConfig().public;
    const endpoint = "apissz/careerJobFeedback";
    const res = await $fetch<any>(apiBase + endpoint, {
      method: "POST",
      body: { ...body, recievers },
    });

    if (!res.success) {
      throw new Error(errorMessage);
    }

    return {
      message: "Запрос успешно отправлен",
    };
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage,
    });
  }
});
