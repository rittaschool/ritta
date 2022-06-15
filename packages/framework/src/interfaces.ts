import { INestMicroservice } from "@nestjs/common";

export interface CreateServiceProps {
  appModule: any;
  queue: Queue;
  name: string;
}

export interface App extends Omit<INestMicroservice, "listen"> {
  start: () => Promise<void>;
}

export interface Queue {
  name: string;
  url: string;
  options?: QueueOptions;
}

export interface QueueOptions {
  durable: boolean;
}
