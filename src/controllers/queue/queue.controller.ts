import { Request, Response } from "express";
import { queueManager } from "../../queues/manager/queue.manager";

export const getQueueStats = async (
  _req: Request,
  res: Response
) => {
  const email = queueManager.email;

  const [
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused,
  ] = await Promise.all([
    email.getWaitingCount(),
    email.getActiveCount(),
    email.getCompletedCount(),
    email.getFailedCount(),
    email.getDelayedCount(),
    email.isPaused(),
  ]);

  res.json({
    healthy: true,

    queues: {
      email: {
        waiting,
        active,
        completed,
        failed,
        delayed,
        paused,
      },
    },
  });
};