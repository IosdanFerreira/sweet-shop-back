export class UnauthorizedError extends Error {
  constructor(public errors: Array<{ property: string; message: string }>) {
    super();
  }
}
