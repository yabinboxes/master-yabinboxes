package com.snow.utils;

import com.snow.entity.PublishSnowDeploymentCommand;
import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.model.DataSourceSnowDeploymentsVolatile;
import com.snow.model.SnowDeploymentsAnonymous;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.OffsetDateTime;

public class DeploymentMapper {

    private static final Logger mapperLog = LoggerFactory.getLogger("deployment-mapper");

    private static String safe(String value) {
        return value != null ? value : "";
    }

    public static DataSourceSnowDeploymentsPersistent entityToDeploymentPersistentMapper(PublishSnowDeploymentCommand publishSnowDeploymentCommand) {
        mapperLog.info("Mapping PublishSnowDeploymentCommand to DataSourceSnowDeploymentsPersistent");
        mapperLog.info("Mapping deployment - SnowName: {}, Type: {}", publishSnowDeploymentCommand.getSnowName(), publishSnowDeploymentCommand.getSnowType());
        DataSourceSnowDeploymentsPersistent dataSourceSnowDeploymentsPersistent = new DataSourceSnowDeploymentsPersistent();
        dataSourceSnowDeploymentsPersistent.setSnowToken("");
        dataSourceSnowDeploymentsPersistent.setActor(safe(publishSnowDeploymentCommand.getActor()));
        dataSourceSnowDeploymentsPersistent.setActorId(safe(publishSnowDeploymentCommand.getActorId()));
        dataSourceSnowDeploymentsPersistent.setEmail(safe(publishSnowDeploymentCommand.getEmail()));
        dataSourceSnowDeploymentsPersistent.setSnowType(safe(publishSnowDeploymentCommand.getSnowType()));
        dataSourceSnowDeploymentsPersistent.setSha(safe(publishSnowDeploymentCommand.getSha()));
        dataSourceSnowDeploymentsPersistent.setGitType(safe(publishSnowDeploymentCommand.getGitType()));
        dataSourceSnowDeploymentsPersistent.setSnowName(safe(publishSnowDeploymentCommand.getSnowName()));
        dataSourceSnowDeploymentsPersistent.setProvider(safe(publishSnowDeploymentCommand.getProvider()));
        dataSourceSnowDeploymentsPersistent.setRepositoryOwner(safe(publishSnowDeploymentCommand.getRepositoryOwner()));
        dataSourceSnowDeploymentsPersistent.setRepository(safe(publishSnowDeploymentCommand.getRepository()));
        dataSourceSnowDeploymentsPersistent.setStatus("default");
        dataSourceSnowDeploymentsPersistent.setPayload(safe(publishSnowDeploymentCommand.getPayload()));
        dataSourceSnowDeploymentsPersistent.setUrl(safe(publishSnowDeploymentCommand.getUrl()));
        dataSourceSnowDeploymentsPersistent.setEnvironment(safe(publishSnowDeploymentCommand.getEnvironment()));
        dataSourceSnowDeploymentsPersistent.setUrlPath(safe(publishSnowDeploymentCommand.getUrlPath()));
        dataSourceSnowDeploymentsPersistent.setPort(safe(publishSnowDeploymentCommand.getPort()));
        dataSourceSnowDeploymentsPersistent.setImage(safe(publishSnowDeploymentCommand.getImage()));
        dataSourceSnowDeploymentsPersistent.setRegistry(safe(publishSnowDeploymentCommand.getRegistry()));
        dataSourceSnowDeploymentsPersistent.setProcessed(0);
        dataSourceSnowDeploymentsPersistent.setNotes("");
        dataSourceSnowDeploymentsPersistent.setDescription(safe(publishSnowDeploymentCommand.getDescription()));
        dataSourceSnowDeploymentsPersistent.setHealthCheckUrl(safe(publishSnowDeploymentCommand.getHealthCheckUrl()));
        dataSourceSnowDeploymentsPersistent.setHealthCheckTime(safe(publishSnowDeploymentCommand.getHealthCheckTime()));
        dataSourceSnowDeploymentsPersistent.setExtras(safe(publishSnowDeploymentCommand.getExtras()));
        dataSourceSnowDeploymentsPersistent.setLicense("no-license");
        dataSourceSnowDeploymentsPersistent.setTabName(safe(publishSnowDeploymentCommand.getTabName()));
        dataSourceSnowDeploymentsPersistent.setTabId(publishSnowDeploymentCommand.getTabId());
        dataSourceSnowDeploymentsPersistent.setLivenessType(safe(publishSnowDeploymentCommand.getLivenessType()));
        dataSourceSnowDeploymentsPersistent.setLivenessStatus(publishSnowDeploymentCommand.getLivenessStatus() != null ? publishSnowDeploymentCommand.getLivenessStatus() : "unknown");
        dataSourceSnowDeploymentsPersistent.setLivenessResponse(safe(publishSnowDeploymentCommand.getLivenessResponse()));
        dataSourceSnowDeploymentsPersistent.setTerraformOutput(safe(publishSnowDeploymentCommand.getTerraformOutput()));
        dataSourceSnowDeploymentsPersistent.setTerraformVars(safe(publishSnowDeploymentCommand.getTerraformVars()));
        dataSourceSnowDeploymentsPersistent.setDockerOutput(safe(publishSnowDeploymentCommand.getDockerOutput()));
        dataSourceSnowDeploymentsPersistent.setDockerVars(safe(publishSnowDeploymentCommand.getDockerVars()));

        mapperLog.info("Successfully mapped to DataSourceSnowDeploymentsPersistent");
        return dataSourceSnowDeploymentsPersistent;
    }

    public static DataSourceSnowDeploymentsVolatile deploymentPersistentToDeploymentVolatileMapper(DataSourceSnowDeploymentsPersistent item) {
        mapperLog.info("Mapping DataSourceSnowDeploymentsPersistent to DataSourceSnowDeploymentsVolatile");
        mapperLog.info("Mapping deployment ID: {}, SnowName: {}", item.getSnowDeploymentId(), item.getSnowName());

        DataSourceSnowDeploymentsVolatile dataSourceSnowDeploymentsVolatile = new DataSourceSnowDeploymentsVolatile();
        dataSourceSnowDeploymentsVolatile.setSnowDeploymentId(item.getSnowDeploymentId());
        dataSourceSnowDeploymentsVolatile.setSnowToken(safe(item.getSnowToken()));
        dataSourceSnowDeploymentsVolatile.setActor(safe(item.getActor()));
        dataSourceSnowDeploymentsVolatile.setActorId(safe(item.getActorId()));
        dataSourceSnowDeploymentsVolatile.setEmail(safe(item.getEmail()));
        dataSourceSnowDeploymentsVolatile.setSnowType(safe(item.getSnowType()));
        dataSourceSnowDeploymentsVolatile.setSha(safe(item.getSha()));
        dataSourceSnowDeploymentsVolatile.setGitType(safe(item.getGitType()));
        dataSourceSnowDeploymentsVolatile.setSnowName(safe(item.getSnowName()));
        dataSourceSnowDeploymentsVolatile.setProvider(safe(item.getProvider()));
        dataSourceSnowDeploymentsVolatile.setRepositoryOwner(safe(item.getRepositoryOwner()));
        dataSourceSnowDeploymentsVolatile.setRepository(safe(item.getRepository()));
        dataSourceSnowDeploymentsVolatile.setStatus(safe(item.getStatus()));
        dataSourceSnowDeploymentsVolatile.setPayload(safe(item.getPayload()));
        dataSourceSnowDeploymentsVolatile.setUrl(safe(item.getUrl()));
        dataSourceSnowDeploymentsVolatile.setEnvironment(safe(item.getEnvironment()));
        dataSourceSnowDeploymentsVolatile.setUrlPath(safe(item.getUrlPath()));
        dataSourceSnowDeploymentsVolatile.setPort(safe(item.getPort()));
        dataSourceSnowDeploymentsVolatile.setImage(safe(item.getImage()));
        dataSourceSnowDeploymentsVolatile.setRegistry(safe(item.getRegistry()));
        dataSourceSnowDeploymentsVolatile.setNotes(safe(item.getNotes()));
        dataSourceSnowDeploymentsVolatile.setExtras(safe(item.getExtras()));
        dataSourceSnowDeploymentsVolatile.setDescription(safe(item.getDescription()));
        dataSourceSnowDeploymentsVolatile.setHealthCheckUrl(safe(item.getHealthCheckUrl()));
        dataSourceSnowDeploymentsVolatile.setHealthCheckTime(safe(item.getHealthCheckTime()));
        dataSourceSnowDeploymentsVolatile.setCreatedAt(OffsetDateTime.now());
        dataSourceSnowDeploymentsVolatile.setLicense(safe(item.getLicense()));
        dataSourceSnowDeploymentsVolatile.setTabName(safe(item.getTabName()));
        dataSourceSnowDeploymentsVolatile.setTabId(item.getTabId());
        dataSourceSnowDeploymentsVolatile.setLivenessType(safe(item.getLivenessType()));
        dataSourceSnowDeploymentsVolatile.setLivenessStatus(item.getLivenessStatus() != null ? item.getLivenessStatus() : "unknown");
        dataSourceSnowDeploymentsVolatile.setLivenessResponse(safe(item.getLivenessResponse()));
        dataSourceSnowDeploymentsVolatile.setTerraformOutput(safe(item.getTerraformOutput()));
        dataSourceSnowDeploymentsVolatile.setTerraformVars(safe(item.getTerraformVars()));
        dataSourceSnowDeploymentsVolatile.setDockerOutput(safe(item.getDockerOutput()));
        dataSourceSnowDeploymentsVolatile.setDockerVars(safe(item.getDockerVars()));

        mapperLog.info("Successfully mapped to DataSourceSnowDeploymentsVolatile with created timestamp");
        return dataSourceSnowDeploymentsVolatile;
    }

    public static DataSourceSnowDeploymentsPersistent deploymentVolatileToDeploymentPersistentMapper(DataSourceSnowDeploymentsVolatile item) {
        mapperLog.info("Mapping DataSourceSnowDeploymentsVolatile to DataSourceSnowDeploymentsPersistent");
        mapperLog.info("Mapping deployment ID: {}, SnowName: {}", item.getSnowDeploymentId(), item.getSnowName());
        mapperLog.info("Marking deployment as processed (processed = 1)");

        DataSourceSnowDeploymentsPersistent dataSourceSnowDeploymentsPersistent = new DataSourceSnowDeploymentsPersistent();
        dataSourceSnowDeploymentsPersistent.setSnowDeploymentId(item.getSnowDeploymentId());
        dataSourceSnowDeploymentsPersistent.setSnowToken(safe(item.getSnowToken()));
        dataSourceSnowDeploymentsPersistent.setActor(safe(item.getActor()));
        dataSourceSnowDeploymentsPersistent.setActorId(safe(item.getActorId()));
        dataSourceSnowDeploymentsPersistent.setEmail(safe(item.getEmail()));
        dataSourceSnowDeploymentsPersistent.setSnowType(safe(item.getSnowType()));
        dataSourceSnowDeploymentsPersistent.setSha(safe(item.getSha()));
        dataSourceSnowDeploymentsPersistent.setGitType(safe(item.getGitType()));
        dataSourceSnowDeploymentsPersistent.setSnowName(safe(item.getSnowName()));
        dataSourceSnowDeploymentsPersistent.setProvider(safe(item.getProvider()));
        dataSourceSnowDeploymentsPersistent.setRepositoryOwner(safe(item.getRepositoryOwner()));
        dataSourceSnowDeploymentsPersistent.setRepository(safe(item.getRepository()));
        dataSourceSnowDeploymentsPersistent.setStatus(safe(item.getStatus()));
        dataSourceSnowDeploymentsPersistent.setPayload(safe(item.getPayload()));
        dataSourceSnowDeploymentsPersistent.setUrl(safe(item.getUrl()));
        dataSourceSnowDeploymentsPersistent.setEnvironment(safe(item.getEnvironment()));
        dataSourceSnowDeploymentsPersistent.setUrlPath(safe(item.getUrlPath()));
        dataSourceSnowDeploymentsPersistent.setPort(safe(item.getPort()));
        dataSourceSnowDeploymentsPersistent.setImage(safe(item.getImage()));
        dataSourceSnowDeploymentsPersistent.setRegistry(safe(item.getRegistry()));
        dataSourceSnowDeploymentsPersistent.setProcessed(1);
        dataSourceSnowDeploymentsPersistent.setNotes(safe(item.getNotes()));
        dataSourceSnowDeploymentsPersistent.setExtras(safe(item.getExtras()));
        dataSourceSnowDeploymentsPersistent.setDescription(safe(item.getDescription()));
        dataSourceSnowDeploymentsPersistent.setHealthCheckUrl(safe(item.getHealthCheckUrl()));
        dataSourceSnowDeploymentsPersistent.setHealthCheckTime(safe(item.getHealthCheckTime()));
        dataSourceSnowDeploymentsPersistent.setLicense(safe(item.getLicense()));
        dataSourceSnowDeploymentsPersistent.setTabName(safe(item.getTabName()));
        dataSourceSnowDeploymentsPersistent.setTabId(item.getTabId());
        dataSourceSnowDeploymentsPersistent.setLivenessType(safe(item.getLivenessType()));
        dataSourceSnowDeploymentsPersistent.setLivenessStatus(item.getLivenessStatus() != null ? item.getLivenessStatus() : "unknown");
        dataSourceSnowDeploymentsPersistent.setLivenessResponse(safe(item.getLivenessResponse()));
        dataSourceSnowDeploymentsPersistent.setTerraformOutput(safe(item.getTerraformOutput()));
        dataSourceSnowDeploymentsPersistent.setTerraformVars(safe(item.getTerraformVars()));
        dataSourceSnowDeploymentsPersistent.setDockerOutput(safe(item.getDockerOutput()));
        dataSourceSnowDeploymentsPersistent.setDockerVars(safe(item.getDockerVars()));

        mapperLog.info("Successfully mapped to DataSourceSnowDeploymentsPersistent with processed flag set");
        return dataSourceSnowDeploymentsPersistent;
    }

    public static SnowDeploymentsAnonymous deploymentVolatileToDeploymentAnonymousMapper(DataSourceSnowDeploymentsVolatile item) {
        mapperLog.info("Mapping DataSourceSnowDeploymentsVolatile to SnowDeploymentsAnonymous (removing sensitive data)");
        mapperLog.info("Mapping deployment ID: {}, SnowName: {}", item.getSnowDeploymentId(), item.getSnowName());
        mapperLog.info("Creating anonymous record without sensitive tokens");

        SnowDeploymentsAnonymous snowDeploymentsAnonymous = new SnowDeploymentsAnonymous();

        snowDeploymentsAnonymous.setSnowType(safe(item.getSnowType()));
        snowDeploymentsAnonymous.setSnowName(safe(item.getSnowName()));
        snowDeploymentsAnonymous.setGitType(safe(item.getGitType()));
        snowDeploymentsAnonymous.setProvider(safe(item.getProvider()));
        snowDeploymentsAnonymous.setActor(safe(item.getActor()));
        snowDeploymentsAnonymous.setActorId(safe(item.getActorId()));
        snowDeploymentsAnonymous.setRepositoryOwner(safe(item.getRepositoryOwner()));
        snowDeploymentsAnonymous.setRepository(safe(item.getRepository()));
        snowDeploymentsAnonymous.setCreatedAt(OffsetDateTime.now());
        snowDeploymentsAnonymous.setUpdatedAt(OffsetDateTime.now());
        snowDeploymentsAnonymous.setStatus(safe(item.getStatus()));
        snowDeploymentsAnonymous.setUrl(safe(item.getUrl()));
        snowDeploymentsAnonymous.setEnvironment(safe(item.getEnvironment()));
        snowDeploymentsAnonymous.setUrlPath(safe(item.getUrlPath()));
        snowDeploymentsAnonymous.setPort(safe(item.getPort()));
        snowDeploymentsAnonymous.setImage(safe(item.getImage()));
        snowDeploymentsAnonymous.setRegistry(safe(item.getRegistry()));
        snowDeploymentsAnonymous.setDescription(safe(item.getDescription()));
        snowDeploymentsAnonymous.setExtras(safe(item.getExtras()));
        snowDeploymentsAnonymous.setPayload(safe(item.getPayload()));
        snowDeploymentsAnonymous.setHealthCheckUrl(safe(item.getHealthCheckUrl()));
        snowDeploymentsAnonymous.setHealthCheckTime(safe(item.getHealthCheckTime()));
        snowDeploymentsAnonymous.setEmail(safe(item.getEmail()));
        snowDeploymentsAnonymous.setNotes(safe(item.getNotes()));
        snowDeploymentsAnonymous.setColor("");
        snowDeploymentsAnonymous.setTabName(safe(item.getTabName()));
        snowDeploymentsAnonymous.setTabId(item.getTabId());
        snowDeploymentsAnonymous.setLivenessType(safe(item.getLivenessType()));
        snowDeploymentsAnonymous.setLivenessStatus(item.getLivenessStatus() != null ? item.getLivenessStatus() : "unknown");
        snowDeploymentsAnonymous.setLivenessResponse(safe(item.getLivenessResponse()));
        snowDeploymentsAnonymous.setTerraformOutput(safe(item.getTerraformOutput()));
        snowDeploymentsAnonymous.setTerraformVars(safe(item.getTerraformVars()));
        snowDeploymentsAnonymous.setDockerOutput(safe(item.getDockerOutput()));
        snowDeploymentsAnonymous.setDockerVars(safe(item.getDockerVars()));
        mapperLog.info("Successfully mapped to SnowDeploymentsAnonymous with timestamps set");
        return snowDeploymentsAnonymous;
    }
}
