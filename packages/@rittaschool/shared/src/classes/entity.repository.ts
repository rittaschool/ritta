import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  // Find one document from the database filtered by the given query
  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>
  ): Promise<T | null> {
    return this.model
      .findOne(entityFilterQuery, {
        ...projection,
      })
      .exec(); // executes
  }

  // Find multiple document filtered by the given query
  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.model.find(entityFilterQuery).exec();
  }

  // Create document
  async create(createEntity: any): Promise<T> {
    const entity = new this.model(createEntity);
    return entity.save();
  }

  // Update one document
  async updateOne(
    entityFilterQuery: FilterQuery<T>,
    updateEntity: UpdateQuery<T>
  ) {
    return this.model.updateOne(entityFilterQuery, updateEntity).exec();
  }

  // TODO: Add remove method
}
