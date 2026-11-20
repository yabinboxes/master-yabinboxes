package com.snow.tasks;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.model.DataSourceSnowDeploymentsVolatile;
import com.snow.model.ProfileOwners;
import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.repository.DataSourceSnowPersistentRepository;
import com.snow.repository.DataSourceSnowVolatileRepository;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.SnowDeploymentsAnonymousRepository;
import com.snow.utils.DeploymentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ScheduledProcessTasks {

    private static final Logger processTaskLog = LoggerFactory.getLogger("process-tasks");

    private final DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository;
    private final DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository;
    private final ProfileOwnersRepository profileOwnersRepository;
    private final SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository;

    public ScheduledProcessTasks(
            DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository,
            DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository,
            ProfileOwnersRepository profileOwnersRepository,
            SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository) {
        this.dataSourceSnowPersistentRepository = dataSourceSnowPersistentRepository;
        this.dataSourceSnowVolatileRepository = dataSourceSnowVolatileRepository;
        this.profileOwnersRepository = profileOwnersRepository;
        this.snowDeploymentsAnonymousRepository = snowDeploymentsAnonymousRepository;
    }

    @Transactional
    @Scheduled(fixedRate = 2000)
    public synchronized void processDeployments() {
        processTaskLog.info("Starting scheduled process task - processing deployments from volatile table");
        processTaskLog.info("Reading batch of 100 records from data source volatile table");

        List<DataSourceSnowDeploymentsVolatile> list = dataSourceSnowVolatileRepository.findBatchRecords(100);
        processTaskLog.info("Retrieved {} records from volatile table", list.size());

        List<DataSourceSnowDeploymentsPersistent> processed = new ArrayList<>();
        List<Long> deleteIds = new ArrayList<>();
        List<SnowDeploymentsAnonymous> anonymousRecords = new ArrayList<>();

        if (!list.isEmpty()) {
            processTaskLog.info("Processing {} volatile deployment records", list.size());

            for (DataSourceSnowDeploymentsVolatile item : list) {
                deleteIds.add(item.getSnowDeploymentId());
                processed.add(DeploymentMapper.deploymentVolatileToDeploymentPersistentMapper(item));

                if (item.getActorId() == null || item.getActorId().isBlank()) {
                    processTaskLog.warn("actorId missing for repository: {} - skipping anonymous deployment upsert",
                            item.getRepository());
                    continue;
                }

                ProfileOwners profile = profileOwnersRepository.getProfileByActorId(item.getActorId(), item.getGitType());
                if (profile == null) {
                    processTaskLog.warn("Profile not found for actorId: {} - skipping anonymous deployment upsert for repository: {}",
                            item.getActorId(), item.getRepository());
                    continue;
                }

                anonymousRecords.add(DeploymentMapper.deploymentVolatileToDeploymentAnonymousMapper(item));
            }

            List<SnowDeploymentsAnonymous> dedupedRecords = new ArrayList<>(
                    anonymousRecords.stream()
                            .collect(Collectors.toMap(
                                    SnowDeploymentsAnonymous::getRepository,
                                    record -> record,
                                    (a, b) -> b,
                                    LinkedHashMap::new
                            ))
                            .values()
            );

            if (!dedupedRecords.isEmpty()) {
                processTaskLog.info("Upserting {} deployment records into snow_deployments_anonymous", dedupedRecords.size());
                snowDeploymentsAnonymousRepository.upsertByRepository(dedupedRecords);
            }

            processTaskLog.info("Updating {} persistent records as processed", processed.size());
            dataSourceSnowPersistentRepository.updateProcessedRecords(processed);

            processTaskLog.info("Deleting {} processed records from volatile table", deleteIds.size());
            dataSourceSnowVolatileRepository.deleteByIds(deleteIds);

            processTaskLog.info("Successfully completed processing deployment batch");
        } else {
            processTaskLog.info("No records found in volatile table - skipping processing");
        }
    }
}
