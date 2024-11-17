import { KanplaError } from "@/services/errors";

export const getErrorMessage = (error: Error) => {
  if (error instanceof KanplaError) {
    return error.getNotification();
  }

  // TODO: Add Sentry trigger or any system to help us know what happened.

  /**
   * No fallback to generic error.message to avoid leaked information of the stack.
   */
  return {
    title: "Something went wrong",
    message: "Please try again later or contact support.",
  };
};
