import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    const result = await this.entityModel
      .findOne(entityFilterQuery, projection)
      .exec();

    return result;
  }

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery).exec();
  }

  async create(createEntityData: Partial<T>): Promise<T> {
    console.log('createEntityData', createEntityData);
    const entity = new this.entityModel(createEntityData);
    console.log(entity);
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        new: true,
      },
    );
  }

  async findByIdAndDelete(id: string, idField?: string): Promise<T> {
    const deleteResult = await this.entityModel.findOneAndRemove({
      [idField || '_id']: id,
    } as any);
    return deleteResult;
  }
}
