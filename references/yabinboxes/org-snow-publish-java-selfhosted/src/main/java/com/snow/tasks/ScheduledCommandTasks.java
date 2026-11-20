package com.snow.tasks;

import com.snow.entity.PublishSnowDeploymentCommand;
import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.model.DataSourceSnowDeploymentsVolatile;
import com.snow.queue.SingletonQueue;
import com.snow.repository.DataSourceSnowPersistentRepository;
import com.snow.repository.DataSourceSnowVolatileRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.snow.utils.DeploymentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class ScheduledCommandTasks {

    private static final Logger commandTaskLog = LoggerFactory.getLogger("command-tasks");

    private final DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository;
    private final DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;
    private final SingletonQueue singletonQueue;

    public ScheduledCommandTasks(
            DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository,
            DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository,
            SingletonQueue singletonQueue) {
        this.dataSourceSnowPersistentRepository = dataSourceSnowPersistentRepository;
        this.dataSourceSnowVolatileRepository = dataSourceSnowVolatileRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
        this.singletonQueue = singletonQueue;
    }

    @Transactional
    @Scheduled(fixedRate = 1000)
    public synchronized void batchDeploymentQueue() {
        commandTaskLog.info("checking queue...");
        if (!singletonQueue.isEmpty()) {
            commandTaskLog.info("batch snow queue");
            commandTaskLog.info("-------------------------");
            commandTaskLog.info("print queue: {}", singletonQueue.returnQueue());

            List<PublishSnowDeploymentCommand> dataSources = singletonQueue.returnQueue().stream().toList();
            profileSnowDeploymentsRepository.ensureTerraformOutputColumns();

            for (PublishSnowDeploymentCommand item : dataSources) {
                DataSourceSnowDeploymentsPersistent persistent =
                        DeploymentMapper.entityToDeploymentPersistentMapper(item);
                dataSourceSnowPersistentRepository.saveAndFlush(persistent);

                DataSourceSnowDeploymentsVolatile volatileRecord =
                        DeploymentMapper.deploymentPersistentToDeploymentVolatileMapper(persistent);
                dataSourceSnowVolatileRepository.save(volatileRecord);
            }

            singletonQueue.cleanQueue();
        }
    }
}
