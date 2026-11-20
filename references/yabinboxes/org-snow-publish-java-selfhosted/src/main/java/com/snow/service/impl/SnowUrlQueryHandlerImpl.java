package com.snow.service.impl;

import com.snow.entity.ProfileWithDeploymentsQuery;
import com.snow.model.ProfileOwners;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.snow.repository.SnowDeploymentsAnonymousRepository;
import com.snow.service.SnowUrlQueryHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SnowUrlQueryHandlerImpl implements SnowUrlQueryHandler {

    private static final Logger urlQueryHandlerLog = LoggerFactory.getLogger("snow-url-query-handler");

    private final ProfileOwnersRepository profileOwnersRepository;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;
    private final SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository;

    public SnowUrlQueryHandlerImpl(
            ProfileOwnersRepository profileOwnersRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository,
            SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository) {
        this.profileOwnersRepository = profileOwnersRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
        this.snowDeploymentsAnonymousRepository = snowDeploymentsAnonymousRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getUrlBySnowName(String snowName, String gitType) {
        urlQueryHandlerLog.info("Looking up url for snowName: {}, gitType: {}", snowName, gitType);

        if (snowName == null || snowName.isBlank()) {
            urlQueryHandlerLog.warn("snowName is required for anonymous url lookup");
            return Optional.empty();
        }

        Optional<String> url = snowDeploymentsAnonymousRepository.findUrlBySnowName(snowName, gitType);
        urlQueryHandlerLog.info("url {} for snowName: {} in snow_deployments_anonymous",
                url.isPresent() ? "found" : "not found", snowName);
        return url;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getRepositoryBySnowName(String snowName, String gitType) {
        urlQueryHandlerLog.info("Looking up repository for snowName: {}, gitType: {}", snowName, gitType);

        if (snowName == null || snowName.isBlank()) {
            urlQueryHandlerLog.warn("snowName is required for anonymous repository lookup");
            return Optional.empty();
        }

        Optional<String> repository = snowDeploymentsAnonymousRepository.findRepositoryBySnowName(snowName, gitType);
        urlQueryHandlerLog.info("repository {} for snowName: {} in snow_deployments_anonymous",
                repository.isPresent() ? "found" : "not found", snowName);
        return repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfileWithDeploymentsQuery> getAllProfilesWithDeployments() {
        urlQueryHandlerLog.info("Loading all profile owners with profile-scoped deployments");

        List<ProfileOwners> profiles = profileOwnersRepository.findAll();
        List<ProfileWithDeploymentsQuery> results = new ArrayList<>(profiles.size());

        for (ProfileOwners profile : profiles) {
            var deployments = profileSnowDeploymentsRepository.findAllByProfileIdReadOnly(profile.getProfileId());
            results.add(new ProfileWithDeploymentsQuery(profile, deployments));
            urlQueryHandlerLog.info("Loaded {} deployments for profileId: {}", deployments.size(), profile.getProfileId());
        }

        urlQueryHandlerLog.info("Returning {} profiles with deployments", results.size());
        return results;
    }
}
