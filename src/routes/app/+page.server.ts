import { scrape } from "$lib/server/scrape";
import { error } from "@sveltejs/kit";
import type { Actions } from "./$types";

function getFormDataAndCheck(data: FormData, name: string): string {
  const value = data.get(name);

  if (!value) {
    throw error(400, `Missing ${name}`);
  }

  return value.toString();
}

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const customerId = getFormDataAndCheck(data, "customer_id");
    const username = getFormDataAndCheck(data, "username");
    const password = getFormDataAndCheck(data, "password");

    const marks = await scrape(customerId, username, password);
    return {
      marks,
    };
  },
};
