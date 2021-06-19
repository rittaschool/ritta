import mongoose from 'mongoose';
import config from '../config';
import logger from '../logger';
export default async () => {
    try {
        const connection = await mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });
        return connection.connection.db;
    }
    catch (error) {
        logger.error(error.message);
        process.exit(-1);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29vc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbG9hZGVycy9tb25nb29zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUE7QUFDL0IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBQy9CLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQztBQUUvQixlQUFlLEtBQUssSUFBa0IsRUFBRTtJQUN0QyxJQUFJO1FBQ0YsTUFBTSxVQUFVLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbkgsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztLQUNqQztJQUFDLE9BQU0sS0FBSyxFQUFFO1FBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUFBIn0=