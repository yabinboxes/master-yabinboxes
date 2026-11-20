package com.snow.service.impl;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.model.ProfileOwners;
import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.repository.DataSourceSnowPersistentRepository;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.snow.repository.SnowDeploymentsAnonymousRepository;
import com.snow.service.SnowDeploymentQueryHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class SnowDeploymentQueryHandlerImpl implements SnowDeploymentQueryHandler {

    private static final Logger queryHandlerLog = LoggerFactory.getLogger("deployment-query-handler");

    private final SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository;
    private final ProfileOwnersRepository profileOwnersRepository;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;
    private final DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository;

    public SnowDeploymentQueryHandlerImpl(
            SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository,
            ProfileOwnersRepository profileOwnersRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository,
            DataSourceSnowPersistentRepository dataSourceSnowPersistentRepository) {
        this.snowDeploymentsAnonymousRepository = snowDeploymentsAnonymousRepository;
        this.profileOwnersRepository = profileOwnersRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
        this.dataSourceSnowPersistentRepository = dataSourceSnowPersistentRepository;
    }

    @Override
    public List<SnowDeploymentsAnonymous> getSnowDeploymentsByActorId(String actorId, String type, String gitType) {
        queryHandlerLog.info("Processing deployment query by actorId - actorId: {}, type: {}, gitType: {}",
                actorId, type, gitType);

        if (actorId == null || actorId.isBlank()) {
            queryHandlerLog.warn("actorId is required for profile deployment lookup");
            return Collections.emptyList();
        }

        ProfileOwners profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
        if (profile == null) {
            queryHandlerLog.warn("No profile found for actorId: {}", actorId);
            return Collections.emptyList();
        }

        List<SnowDeploymentsAnonymous> deployments =
                profileSnowDeploymentsRepository.findAllByProfileId(profile.getProfileId(), type);
        queryHandlerLog.info("Retrieved {} deployment records from snow_deployments_{}", deployments.size(), profile.getProfileId());
        return deployments;
    }

    @Override
    public List<SnowDeploymentsAnonymous> getAllSnowDeployments() {
        queryHandlerLog.info("Retrieving all anonymous deployment records");
        List<SnowDeploymentsAnonymous> deployments = snowDeploymentsAnonymousRepository.listAll();
        queryHandlerLog.info("Retrieved {} anonymous deployment records", deployments.size());
        return deployments;
    }

    @Override
    public List<DataSourceSnowDeploymentsPersistent> getAllPersistentSnowDeployments() {
        queryHandlerLog.info("Retrieving all persistent deployment records");
        List<DataSourceSnowDeploymentsPersistent> deployments = dataSourceSnowPersistentRepository.findAll();
        queryHandlerLog.info("Retrieved {} persistent deployment records", deployments.size());
        return deployments;
    }
}
