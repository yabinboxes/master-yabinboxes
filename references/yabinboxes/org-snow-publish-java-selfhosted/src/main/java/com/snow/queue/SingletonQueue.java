package com.snow.queue;

import com.snow.entity.PublishSnowDeploymentCommand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class SingletonQueue {

    private static final Logger queueLog = LoggerFactory.getLogger("singleton-queue");

    private final BlockingQueue<PublishSnowDeploymentCommand> data = new LinkedBlockingQueue<>();

    public SingletonQueue() {
        queueLog.info("Initializing singleton queue with LinkedBlockingQueue");
        queueLog.info("Singleton queue initialized successfully");
    }

    public boolean isEmpty() {
        boolean empty = data.isEmpty();
        queueLog.info("Checking if queue is empty: {} (queue size: {})", empty, data.size());
        return empty;
    }

    public void addData(PublishSnowDeploymentCommand publishSnowDeploymentCommand) {
        queueLog.info("Adding deployment command to queue - SnowName: {}", publishSnowDeploymentCommand.getSnowName());
        data.add(publishSnowDeploymentCommand);
        queueLog.info("Deployment command added successfully. Queue size: {}", data.size());
    }

    public BlockingQueue<PublishSnowDeploymentCommand> returnQueue() {
        queueLog.info("Returning queue reference. Current queue size: {}", data.size());
        return data;
    }

    public void cleanQueue() {
        int sizeBefore = data.size();
        queueLog.info("Cleaning queue - removing {} items", sizeBefore);
        data.clear();
        queueLog.info("Queue cleaned successfully. Queue size: {}", data.size());
    }
}
