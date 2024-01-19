import { browser } from "$app/environment";
import PocketBase from "pocketbase";
import { writable } from "svelte/store";

export const pb = writable<PocketBase | undefined>(undefined, (set) => {
  if (!browser) {
    return;
  }
  const pocketBaseInstance = new PocketBase("http://127.0.0.1:8090");
  set(pocketBaseInstance);
});
