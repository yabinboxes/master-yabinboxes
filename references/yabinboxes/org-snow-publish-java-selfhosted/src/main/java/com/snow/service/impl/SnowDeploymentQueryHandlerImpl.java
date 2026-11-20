package com.snow.service.impl;

import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.repository.SnowDeploymentsAnonymousRepository;
import com.snow.service.SnowDeploymentQueryHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SnowDeploymentQueryHandlerImpl implements SnowDeploymentQueryHandler {

    private static final Logger queryHandlerLog = LoggerFactory.getLogger("deployment-query-handler");

    private final SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository;

    public SnowDeploymentQueryHandlerImpl(SnowDeploymentsAnonymousRepository snowDeploymentsAnonymousRepository) {
        this.snowDeploymentsAnonymousRepository = snowDeploymentsAnonymousRepository;
    }

    @Override
    public List<SnowDeploymentsAnonymous> getSnowDeployments() {
        queryHandlerLog.info("Retrieving deployment records from snow_deployments_anonymous");
        List<SnowDeploymentsAnonymous> deployments = snowDeploymentsAnonymousRepository.listAll();
        queryHandlerLog.info("Retrieved {} deployment records from snow_deployments_anonymous", deployments.size());
        return deployments;
    }

    @Override
    public List<SnowDeploymentsAnonymous> getAllSnowDeployments() {
        queryHandlerLog.info("Retrieving all anonymous deployment records");
        List<SnowDeploymentsAnonymous> deployments = snowDeploymentsAnonymousRepository.listAll();
        queryHandlerLog.info("Retrieved {} anonymous deployment records", deployments.size());
        return deployments;
    }
}
