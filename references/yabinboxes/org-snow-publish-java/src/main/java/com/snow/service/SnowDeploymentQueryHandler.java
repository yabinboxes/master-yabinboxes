package com.snow.service;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.model.SnowDeploymentsAnonymous;

import java.util.List;

public interface SnowDeploymentQueryHandler {
    List<SnowDeploymentsAnonymous> getSnowDeploymentsByActorId(String actorId, String type, String gitType);

    List<SnowDeploymentsAnonymous> getAllSnowDeployments();

    List<DataSourceSnowDeploymentsPersistent> getAllPersistentSnowDeployments();
}
