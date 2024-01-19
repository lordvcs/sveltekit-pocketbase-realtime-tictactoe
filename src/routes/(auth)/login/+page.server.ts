import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals }) => {
    if (locals.pocketBase.authStore.isValid) {
      redirect(303, "/");
    }

    const { email, password } = Object.fromEntries(await request.formData());

    try {
      await locals.pocketBase
        .collection("users")
        .authWithPassword(email as string, password as string);
    } catch (error) {
      console.error(error);

      if (!(error instanceof Error)) {
        return {
          email,
          password,
          error: "Unknown error occurred when signing up",
        };
      }

      return {
        error: error.message,
        name,
        email,
        password,
      };
    }

    redirect(303, "/");
  },
};
