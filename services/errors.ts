export class KanplaError extends Error {
  response?: Response;

  constructor(message: string) {
    super(message);
    this.name = "KanplaError";
  }

  /**
   * Because no internationalization is implemented, the notification title is the same as the error message.
   * It goes to a generic fallback message.
   */
  getNotification() {
    return {
      title: "Something went wrong",
      message: "Please try again later or contact support.",
    };
  }
}
