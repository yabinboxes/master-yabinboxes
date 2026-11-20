package com.snow.tasks;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.model.DataSourceSnowDeploymentsVolatile;
import com.snow.model.ProfileOwners;
import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.repository.DataSourceSnowPersistentRepository;
import com.snow.repository.DataSourceSnowVolatileRepository;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.snow.utils.DeploymentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ScheduledProcessTasks {

    private static final Logger processTaskLog = LoggerFactory.getLogger("process-tasks");

    private final DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository;
    private final DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository;
    private final ProfileOwnersRepository profileOwnersRepository;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;

    public ScheduledProcessTasks(
            DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository,
            DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository,
            ProfileOwnersRepository profileOwnersRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository) {
        this.dataSourceSnowPersistentRepository = dataSourceSnowPersistentRepository;
        this.dataSourceSnowVolatileRepository = dataSourceSnowVolatileRepository;
        this.profileOwnersRepository = profileOwnersRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
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
        Map<Long, List<SnowDeploymentsAnonymous>> profileDeployments = new LinkedHashMap<>();

        if (!list.isEmpty()) {
            processTaskLog.info("Processing {} volatile deployment records", list.size());

            for (DataSourceSnowDeploymentsVolatile item : list) {
                deleteIds.add(item.getSnowDeploymentId());
                processed.add(DeploymentMapper.deploymentVolatileToDeploymentPersistentMapper(item));

                if (item.getActorId() == null || item.getActorId().isBlank()) {
                    processTaskLog.warn("actorId missing for repository: {} - skipping profile deployment upsert",
                            item.getRepository());
                    continue;
                }

                ProfileOwners profile = profileOwnersRepository.getProfileByActorId(item.getActorId(), item.getGitType());
                if (profile == null) {
                    processTaskLog.warn("Profile not found for actorId: {} - skipping profile deployment upsert for repository: {}",
                            item.getActorId(), item.getRepository());
                    continue;
                }

                profileDeployments
                        .computeIfAbsent(profile.getProfileId(), profileId -> new ArrayList<>())
                        .add(DeploymentMapper.deploymentVolatileToDeploymentAnonymousMapper(item));
            }

            for (Map.Entry<Long, List<SnowDeploymentsAnonymous>> entry : profileDeployments.entrySet()) {
                List<SnowDeploymentsAnonymous> dedupedRecords = new ArrayList<>(
                        entry.getValue().stream()
                                .collect(Collectors.toMap(
                                        SnowDeploymentsAnonymous::getRepository,
                                        record -> record,
                                        (a, b) -> b,
                                        LinkedHashMap::new
                                ))
                                .values()
                );

                processTaskLog.info("Ensuring profile deployments table exists for profile ID: {}", entry.getKey());
                profileSnowDeploymentsRepository.createTableIfNotExists(entry.getKey());

                processTaskLog.info("Upserting {} deployment records for profile ID: {}", dedupedRecords.size(), entry.getKey());
                profileSnowDeploymentsRepository.upsertProfileDeployments(entry.getKey(), dedupedRecords);
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
