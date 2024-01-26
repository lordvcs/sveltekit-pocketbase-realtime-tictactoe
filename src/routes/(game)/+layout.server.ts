import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
  if (!locals.pocketBase.authStore.isValid) {
    redirect(303, "/login");
  }
  return {}
}