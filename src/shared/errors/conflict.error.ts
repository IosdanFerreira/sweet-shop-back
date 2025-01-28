export class ConflictError extends Error {
  constructor(public errors: Array<{ property: string; message: string }>) {
    super();
  }
}
