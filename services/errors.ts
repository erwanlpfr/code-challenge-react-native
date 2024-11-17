export class KanplaError extends Error {
  response?: Response;

  constructor(message: string) {
    super(message);
    this.name = "KanplaError";
  }
}
