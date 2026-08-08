import { Request, Response } from "express";
import { queueManager } from "../../queues/manager/queue.manager";

export const getQueueHealth = async (
  _req: Request,
  res: Response
) => {
 try {
  await queueManager.email.waitUntilReady();

  res.json({
    healthy: true,
    timestamp: new Date().toISOString(),
    queues: [
      {
        name: "email",
        status: "UP",
      },
    ],
  });
}
 catch {
    res.status(503).json({
      healthy: false,
      timestamp: new Date().toISOString(),
      queues: [
        {
          name: "email",
          status: "DOWN",
        },
      ],
    });
  }
};