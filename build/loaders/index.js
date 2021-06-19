import expressLoader from './express';
import mongooseLoader from './mongoose';
import logger from '../logger';
export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    logger.info('MongoDB Initialized');
    await expressLoader({ app: expressApp });
    logger.info('Express Initialized');
    return {
        mongoConnection,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbG9hZGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGFBQWEsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxjQUFjLE1BQU0sWUFBWSxDQUFDO0FBQ3hDLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQztBQUUvQixlQUFlLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFnQixFQUFFO0lBQ3BELE1BQU0sZUFBZSxHQUFHLE1BQU0sY0FBYyxFQUFFLENBQUM7SUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRW5DLE1BQU0sYUFBYSxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRW5DLE9BQU87UUFDTCxlQUFlO0tBQ2hCLENBQUE7QUFDSCxDQUFDLENBQUEifQ==