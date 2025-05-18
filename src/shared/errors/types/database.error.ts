export class DatabaseError extends Error {
  constructor(
    public message: string,
    public errors?: Array<{ property: string; message: string }>
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
