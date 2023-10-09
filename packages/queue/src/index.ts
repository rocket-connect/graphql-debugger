import fastq from "fastq";

export enum QueueType {
  InMemory = "in-memory",
}

export class Queue<Data> {
  private readonly queue: fastq.queue<Data>;

  constructor({
    type,
    worker,
  }: {
    type: QueueType;
    worker: (data: Data) => Promise<void>;
  }) {
    if (type !== QueueType.InMemory) {
      throw new Error(`Queue type ${type} not implemented`);
    }

    const concurrency = 1;

    this.queue = fastq.promise<Data>(worker, concurrency);
  }

  async start() {
    await this.queue.length();
  }

  public async add(data: Data) {
    await this.queue.push(data);
  }
}
