import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
  if (!locals.pocketBase.authStore.isValid) {
    throw redirect(303, "/login");
  }
}