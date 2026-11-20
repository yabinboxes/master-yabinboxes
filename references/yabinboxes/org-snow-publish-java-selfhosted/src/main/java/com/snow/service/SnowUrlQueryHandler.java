package com.snow.service;

import com.snow.entity.ProfileWithDeploymentsQuery;

import java.util.List;
import java.util.Optional;

public interface SnowUrlQueryHandler {
    Optional<String> getUrlBySnowName(String snowName, String gitType);

    Optional<String> getRepositoryBySnowName(String snowName, String gitType);

    List<ProfileWithDeploymentsQuery> getAllProfilesWithDeployments();
}
