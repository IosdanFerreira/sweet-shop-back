export class NotFoundError extends Error {
  constructor(public errors: Array<{ property: string; message: string }>) {
    super();
  }
}
