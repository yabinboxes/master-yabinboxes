package com.snow.service;

import com.snow.entity.PublishSnowDeploymentCommand;
import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.utils.Type;

import java.util.List;

public interface SnowDeploymentCommandHandler {
    Boolean addSnowDeploymentToQueue(PublishSnowDeploymentCommand publishSnowDeploymentCommand, Type type);
    Boolean deleteByRepository(String repository, String actorId, String gitType);
    void truncateTables();
    List<SnowDeploymentsAnonymous> getAllByTableName(String tableName);
    Boolean updateDeploymentColor(Long snowDeploymentId, String color);
    Boolean updateDeploymentLivenessType(Long snowDeploymentId, String livenessType);
    Boolean deleteDeploymentLivenessType(Long snowDeploymentId);
    Boolean updateDeploymentLivenessStatus(Long snowDeploymentId, String livenessStatus);
    Boolean updateDeploymentLivenessStatusByRepository(String repository, String livenessStatus);
    Boolean updateDeploymentLivenessStatusAndResponseByRepository(String repository, String livenessStatus, String livenessResponse);
    Boolean deleteDeploymentLivenessStatus(Long snowDeploymentId);
}
