import { Ref, watchEffect } from "vue";
import { _AsyncData } from "#app/composables/asyncData";

export const useFormResponse = (
  request: _AsyncData<{ message: string }, any>,
  pending: Ref<boolean>,
  response: Ref<{ success: boolean; message: string }>
) => {
  watchEffect(() => {
    // consecutive requests with no changes
    if (request.error.value === true) {
      return;
    }

    pending.value = true;

    setTimeout(() => {
      if (request.error.value) {
        response.value = {
          success: false,
          message:
            request.error.value.data.statusMessage ||
            "Es ist ein Fehler aufgetreten",
        };
        pending.value = false;
        return;
      }

      pending.value = false;
      response.value = {
        success: true,
        message: request.data.value?.message,
      };
    }, 500);
  });
};
