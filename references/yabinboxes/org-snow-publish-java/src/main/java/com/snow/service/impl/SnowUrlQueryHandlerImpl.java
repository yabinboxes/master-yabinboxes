package com.snow.service.impl;

import com.snow.entity.ProfileWithDeploymentsQuery;
import com.snow.model.ProfileOwners;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
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

    public SnowUrlQueryHandlerImpl(
            ProfileOwnersRepository profileOwnersRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository) {
        this.profileOwnersRepository = profileOwnersRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getUrlBySnowName(String snowName, String actorId, String gitType) {
        urlQueryHandlerLog.info("Looking up url for snowName: {}, actorId: {}, gitType: {}", snowName, actorId, gitType);

        if (actorId == null || actorId.isBlank()) {
            urlQueryHandlerLog.warn("actorId is required for profile url lookup");
            return Optional.empty();
        }

        var profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
        if (profile == null) {
            urlQueryHandlerLog.warn("No profile found for actorId: {}", actorId);
            return Optional.empty();
        }

        Optional<String> url = profileSnowDeploymentsRepository.findUrlBySnowName(
                profile.getProfileId(), snowName, gitType);
        urlQueryHandlerLog.info("url {} for snowName: {} in snow_deployments_{}",
                url.isPresent() ? "found" : "not found", snowName, profile.getProfileId());
        return url;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getRepositoryBySnowName(String snowName, String actorId, String gitType) {
        urlQueryHandlerLog.info("Looking up repository for snowName: {}, actorId: {}, gitType: {}",
                snowName, actorId, gitType);

        if (actorId == null || actorId.isBlank()) {
            urlQueryHandlerLog.warn("actorId is required for profile repository lookup");
            return Optional.empty();
        }

        var profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
        if (profile == null) {
            urlQueryHandlerLog.warn("No profile found for actorId: {}", actorId);
            return Optional.empty();
        }

        Optional<String> repository = profileSnowDeploymentsRepository.findRepositoryBySnowName(
                profile.getProfileId(), snowName, gitType);
        urlQueryHandlerLog.info("repository {} for snowName: {} in snow_deployments_{}",
                repository.isPresent() ? "found" : "not found", snowName, profile.getProfileId());
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
