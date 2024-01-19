export const load = async ({ locals }) => {
  return {
    authenticated: locals.pocketBase.authStore.isValid,
  };
};
