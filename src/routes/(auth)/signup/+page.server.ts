import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals }) => {
    if (locals.pocketBase.authStore.isValid) {
      redirect(303, "/");
    }

    const { name, email, password } = Object.fromEntries<string>(
      (await request.formData()) as any
    );

    if (password?.length < 8)
      return fail(400, { error: "Password should be of atleast 8 characters" });

    try {
      await locals.pocketBase.collection("users").create({
        name,
        email,
        password,
        passwordConfirm: password,
      });
      await locals.pocketBase
        .collection("users")
        .authWithPassword(email as string, password as string);
    } catch (error) {
      console.error(error);

      if (!(error instanceof Error)) {
        return {
          name,
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
