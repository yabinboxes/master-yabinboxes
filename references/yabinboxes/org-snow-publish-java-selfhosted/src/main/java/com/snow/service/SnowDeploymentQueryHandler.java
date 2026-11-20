package com.snow.service;

import com.snow.model.SnowDeploymentsAnonymous;

import java.util.List;

public interface SnowDeploymentQueryHandler {
    List<SnowDeploymentsAnonymous> getSnowDeployments();

    List<SnowDeploymentsAnonymous> getAllSnowDeployments();
}
