import { Entity, Repository, Schema } from 'redis-om';
import { Challenge as Challe } from '@rittaschool/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Challenge extends Challe {}

export type ChallengeRepository = Repository<Challenge>;

class Challenge extends Entity {}

const schema = new Schema(
  Challenge,
  {
    id: { type: 'string' },
    type: { type: 'string' },
    userId: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  },
);

export default schema;
