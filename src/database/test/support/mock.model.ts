export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  constructorSpy(_createEntityData: T): void {}

  findOne(): { exec: () => T } {
    return {
      exec: () => {
        return {
          ...this.entityStub,
          toObject: () => this.entityStub as T,
        };
      },
      // exec: (): T => this.entityStub,
    };
  }

  find(): { exec: () => [T & { toObject: () => T }] } {
    return {
      exec: () => [{ ...this.entityStub, toObject: () => this.entityStub }],
    };
  }

  async save(): Promise<T> {
    return this.entityStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.entityStub;
  }
}
