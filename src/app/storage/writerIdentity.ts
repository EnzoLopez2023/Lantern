export type WriterIdFactory = () => string;

export class DocumentWriterIdentity {
  readonly id: string;

  constructor(factory: WriterIdFactory) {
    this.id = factory();
    if (!this.id) throw new Error('Storage writer ID must not be empty.');
  }
}
