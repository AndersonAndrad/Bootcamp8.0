// dependencies 
import Bee from 'bee-queue';

// files
import redisConfig from '../config/redis';

// jobs
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ Key, handle}) => {
      this.queues[Key] = {
        bee: new Bee(Key, { redis: redisConfig }),
        handle,
      }
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();  
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.Key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: failed`, err);
  }
}

export default new Queue();