package com.snow.service.impl;

import com.snow.entity.PublishSnowDeploymentCommand;
import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.queue.SingletonQueue;
import com.snow.repository.DataSourceSnowPersistentRepository;
import com.snow.repository.DataSourceSnowVolatileRepository;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.snow.repository.SnowDeploymentsAnonymousRepository;
import com.snow.service.SnowDeploymentCommandHandler;
import com.snow.utils.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SnowDeploymentCommandHandlerImpl implements SnowDeploymentCommandHandler {

    private static final Logger commandHandlerLog = LoggerFactory.getLogger("deployment-command-handler");

    private final DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository;
    private final DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository;
    private final SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository;
    private final ProfileOwnersRepository profileOwnersRepository;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;
    private final SingletonQueue singletonQueue;

    public SnowDeploymentCommandHandlerImpl(
            DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository,
            DataSourceSnowVolatileRepository dataSourceSnowVolatileRepository,
            SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository,
            ProfileOwnersRepository profileOwnersRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository,
            SingletonQueue singletonQueue) {
        this.dataSourceSnowPersistentRepository = dataSourceSnowPersistentRepository;
        this.dataSourceSnowVolatileRepository = dataSourceSnowVolatileRepository;
        this.snowDeploymentsAnonymousRepository = snowDeploymentsAnonymousRepository;
        this.profileOwnersRepository = profileOwnersRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
        this.singletonQueue = singletonQueue;
    }

    @Override
    public Boolean addSnowDeploymentToQueue(PublishSnowDeploymentCommand publishSnowDeploymentCommand, Type type) {
        commandHandlerLog.info("Processing deployment command handler - adding to queue");
        commandHandlerLog.info("Deployment command - SnowName: {}, Type: {}", publishSnowDeploymentCommand.getSnowName(), type);

        try {
            commandHandlerLog.info("Adding deployment command to singleton queue");
            singletonQueue.addData(publishSnowDeploymentCommand);
            commandHandlerLog.info("Successfully added deployment command to queue");
            return true;
        } catch (Exception exception) {
            commandHandlerLog.error("Error occurred while adding deployment command to queue: {}", exception.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public Boolean deleteByRepository(String repository, String actorId, String gitType) {
        commandHandlerLog.info("Deleting deployment by repository: {}, actorId: {}, gitType: {}",
                repository, actorId, gitType);

        if (repository == null || repository.isBlank() || actorId == null || actorId.isBlank()) {
            commandHandlerLog.warn("repository and actorId are required to delete a deployment");
            return false;
        }

        var profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
        if (profile == null) {
            commandHandlerLog.warn("No profile found for actorId: {}, gitType: {} - cannot delete deployment",
                    actorId, gitType);
            return false;
        }

        boolean success = profileSnowDeploymentsRepository.deleteByRepository(profile.getProfileId(), repository);
        if (success) {
            commandHandlerLog.info("Successfully deleted deployment for repository: {} from snow_deployments_{}",
                    repository, profile.getProfileId());
        } else {
            commandHandlerLog.warn("Deployment not found for repository: {} in snow_deployments_{}",
                    repository, profile.getProfileId());
        }
        return success;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SnowDeploymentsAnonymous> getAllByTableName(String tableName) {
        if (tableName == null || tableName.isBlank()) {
            return null;
        }

        Optional<String> tableRef = ProfileSnowDeploymentsRepository.resolveTableRef(tableName);
        if (tableRef.isEmpty()) {
            return null;
        }

        String bareName = tableRef.get().substring("connectors.".length());
        if ("snow_deployments_anonymous".equals(bareName)) {
            return snowDeploymentsAnonymousRepository.listAll();
        }

        return profileSnowDeploymentsRepository.findAllByTableRef(tableRef.get());
    }

    @Override
    @Transactional
    public synchronized void truncateTables() {
        profileOwnersRepository.truncateTable();
        dataSourceSnowPersistentRepository.truncateTable();
        dataSourceSnowVolatileRepository.truncateTable();
        snowDeploymentsAnonymousRepository.truncateTable();
    }

    @Override
    @Transactional
    public Boolean updateDeploymentColor(Long snowDeploymentId, String color) {
        commandHandlerLog.info("Updating color for deployment ID: {} to: {}", snowDeploymentId, color);
        boolean success = snowDeploymentsAnonymousRepository.updateColor(snowDeploymentId, color);
        if (success) {
            commandHandlerLog.info("Successfully updated color for deployment ID: {}", snowDeploymentId);
        } else {
            commandHandlerLog.warn("Failed to update color for deployment ID: {} - deployment not found", snowDeploymentId);
        }
        return success;
    }

    @Override
    @Transactional
    public Boolean updateDeploymentLivenessType(Long snowDeploymentId, String livenessType) {
        commandHandlerLog.info("Updating liveness type for deployment ID: {} to: {}", snowDeploymentId, livenessType);
        boolean success = snowDeploymentsAnonymousRepository.updateLivenessType(snowDeploymentId, livenessType);
        if (success) {
            commandHandlerLog.info("Successfully updated liveness type for deployment ID: {}", snowDeploymentId);
        } else {
            commandHandlerLog.warn("Failed to update liveness type for deployment ID: {} - deployment not found", snowDeploymentId);
        }
        return success;
    }

    @Override
    @Transactional
    public Boolean deleteDeploymentLivenessType(Long snowDeploymentId) {
        commandHandlerLog.info("Deleting liveness type for deployment ID: {}", snowDeploymentId);
        boolean success = snowDeploymentsAnonymousRepository.updateLivenessType(snowDeploymentId, null);
        if (success) {
            commandHandlerLog.info("Successfully deleted liveness type for deployment ID: {}", snowDeploymentId);
        } else {
            commandHandlerLog.warn("Failed to delete liveness type for deployment ID: {} - deployment not found", snowDeploymentId);
        }
        return success;
    }

    @Override
    @Transactional
    public Boolean updateDeploymentLivenessStatus(Long snowDeploymentId, String livenessStatus) {
        commandHandlerLog.info("Updating liveness status for deployment ID: {} to: {}", snowDeploymentId, livenessStatus);
        boolean success = snowDeploymentsAnonymousRepository.updateLivenessStatus(snowDeploymentId, livenessStatus);
        if (success) {
            commandHandlerLog.info("Successfully updated liveness status for deployment ID: {}", snowDeploymentId);
        } else {
            commandHandlerLog.warn("Failed to update liveness status for deployment ID: {} - deployment not found", snowDeploymentId);
        }
        return success;
    }

    @Override
    @Transactional
    public Boolean updateDeploymentLivenessStatusByRepository(String repository, String livenessStatus) {
        commandHandlerLog.info("Updating liveness status for repository: {} to: {}", repository, livenessStatus);
        boolean success = snowDeploymentsAnonymousRepository.updateLivenessStatusByRepository(repository, livenessStatus);
        if (success) {
            commandHandlerLog.info("Successfully updated liveness status for repository: {}", repository);
        } else {
            commandHandlerLog.warn("Failed to update liveness status for repository: {} - deployment not found", repository);
        }
        return success;
    }

    @Override
    @Transactional
    public Boolean updateDeploymentLivenessStatusAndResponseByRepository(String repository, String livenessStatus, String livenessResponse) {
        commandHandlerLog.info("Updating liveness status and response for repository: {}", repository);
        boolean success = snowDeploymentsAnonymousRepository.updateLivenessStatusAndLivenessResponseByRepository(
                repository, livenessStatus, livenessResponse);
        if (success) {
            commandHandlerLog.info("Successfully updated liveness status and response for repository: {}", repository);
        } else {
            commandHandlerLog.warn("Failed to update liveness for repository: {} - deployment not found", repository);
        }
        return success;
    }

    @Override
    @Transactional
    public Boolean deleteDeploymentLivenessStatus(Long snowDeploymentId) {
        commandHandlerLog.info("Deleting liveness status for deployment ID: {}", snowDeploymentId);
        boolean success = snowDeploymentsAnonymousRepository.updateLivenessStatus(snowDeploymentId, null);
        if (success) {
            commandHandlerLog.info("Successfully deleted liveness status for deployment ID: {}", snowDeploymentId);
        } else {
            commandHandlerLog.warn("Failed to delete liveness status for deployment ID: {} - deployment not found", snowDeploymentId);
        }
        return success;
    }
}
