package com.snow.repository;

import com.snow.model.SnowDeploymentsAnonymous;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class SnowDeploymentsAnonymousRepository {

    private static final Logger anonymousRepoLog = LoggerFactory.getLogger("anonymous-repository");

    @PersistenceContext
    private EntityManager entityManager;

    private final SnowDeploymentsAnonymousJpaRepository jpaRepository;

    public SnowDeploymentsAnonymousRepository(SnowDeploymentsAnonymousJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    public Optional<String> findUrlBySnowName(String snowName) {
        anonymousRepoLog.info("Finding url by snowName: {}", snowName);
        return jpaRepository.findFirstBySnowName(snowName).map(SnowDeploymentsAnonymous::getUrl);
    }

    public Optional<String> findUrlBySnowName(String snowName, String gitType) {
        return findFirstBySnowName(snowName, gitType).map(SnowDeploymentsAnonymous::getUrl);
    }

    public Optional<String> findRepositoryBySnowName(String snowName, String gitType) {
        return findFirstBySnowName(snowName, gitType).map(SnowDeploymentsAnonymous::getRepository);
    }

    @Transactional
    public void upsertByRepository(List<SnowDeploymentsAnonymous> records) {
        if (records == null || records.isEmpty()) {
            return;
        }

        anonymousRepoLog.info("Upserting {} deployment records into connectors.snow_deployments_anonymous", records.size());

        for (SnowDeploymentsAnonymous record : records) {
            entityManager.createNativeQuery("""
                    INSERT INTO connectors.snow_deployments_anonymous (
                        snow_type, snow_name, git_type, provider, actor, actor_id, email, repository_owner, repository,
                        environment, created_at, updated_at, status, url, url_path, port, image, registry,
                        description, extras, payload, health_check_url, health_check_time, notes, color,
                        liveness_type, liveness_status, liveness_response, tab_name, tab_id, terraform_output,
                        terraform_vars, docker_output, docker_vars
                    ) VALUES (
                        :snowType, :snowName, :gitType, :provider, :actor, :actorId, :email, :repositoryOwner, :repository,
                        :environment, :createdAt, :updatedAt, :status, :url, :urlPath, :port, :image, :registry,
                        :description, :extras, :payload, :healthCheckUrl, :healthCheckTime, :notes, :color,
                        :livenessType, :livenessStatus, :livenessResponse, :tabName, :tabId, :terraformOutput,
                        :terraformVars, :dockerOutput, :dockerVars
                    )
                    ON CONFLICT (repository) DO UPDATE SET
                        snow_type = EXCLUDED.snow_type,
                        snow_name = EXCLUDED.snow_name,
                        git_type = EXCLUDED.git_type,
                        provider = EXCLUDED.provider,
                        actor = EXCLUDED.actor,
                        actor_id = EXCLUDED.actor_id,
                        email = EXCLUDED.email,
                        repository_owner = EXCLUDED.repository_owner,
                        status = EXCLUDED.status,
                        url = EXCLUDED.url,
                        environment = EXCLUDED.environment,
                        url_path = EXCLUDED.url_path,
                        tab_name = EXCLUDED.tab_name,
                        tab_id = EXCLUDED.tab_id,
                        port = EXCLUDED.port,
                        image = EXCLUDED.image,
                        registry = EXCLUDED.registry,
                        description = EXCLUDED.description,
                        extras = EXCLUDED.extras,
                        payload = EXCLUDED.payload,
                        health_check_url = EXCLUDED.health_check_url,
                        health_check_time = EXCLUDED.health_check_time,
                        notes = EXCLUDED.notes,
                        terraform_output = EXCLUDED.terraform_output,
                        terraform_vars = EXCLUDED.terraform_vars,
                        docker_output = EXCLUDED.docker_output,
                        docker_vars = EXCLUDED.docker_vars,
                        updated_at = now()
                    """)
                    .setParameter("snowType", record.getSnowType())
                    .setParameter("snowName", record.getSnowName())
                    .setParameter("gitType", record.getGitType())
                    .setParameter("provider", record.getProvider())
                    .setParameter("actor", record.getActor())
                    .setParameter("actorId", record.getActorId())
                    .setParameter("email", record.getEmail())
                    .setParameter("repositoryOwner", record.getRepositoryOwner())
                    .setParameter("repository", record.getRepository())
                    .setParameter("environment", record.getEnvironment())
                    .setParameter("createdAt", record.getCreatedAt())
                    .setParameter("updatedAt", record.getUpdatedAt())
                    .setParameter("status", record.getStatus())
                    .setParameter("url", record.getUrl())
                    .setParameter("urlPath", record.getUrlPath())
                    .setParameter("port", record.getPort())
                    .setParameter("image", record.getImage())
                    .setParameter("registry", record.getRegistry())
                    .setParameter("description", record.getDescription())
                    .setParameter("extras", record.getExtras())
                    .setParameter("payload", record.getPayload())
                    .setParameter("healthCheckUrl", record.getHealthCheckUrl())
                    .setParameter("healthCheckTime", record.getHealthCheckTime())
                    .setParameter("notes", record.getNotes())
                    .setParameter("color", record.getColor())
                    .setParameter("livenessType", record.getLivenessType())
                    .setParameter("livenessStatus", record.getLivenessStatus())
                    .setParameter("livenessResponse", record.getLivenessResponse())
                    .setParameter("tabName", record.getTabName())
                    .setParameter("tabId", record.getTabId())
                    .setParameter("terraformOutput", record.getTerraformOutput())
                    .setParameter("terraformVars", record.getTerraformVars())
                    .setParameter("dockerOutput", record.getDockerOutput())
                    .setParameter("dockerVars", record.getDockerVars())
                    .executeUpdate();
            System.out.println("Database insert connectors.snow_deployments_anonymous: snowName="
                    + record.getSnowName()
                    + ", snowType=" + record.getSnowType()
                    + ", repository=" + record.getRepository()
                    + ", actorId=" + record.getActorId());
        }

        anonymousRepoLog.info("Successfully upserted {} deployment records into connectors.snow_deployments_anonymous", records.size());
    }

    private Optional<SnowDeploymentsAnonymous> findFirstBySnowName(String snowName, String gitType) {
        if (snowName == null || snowName.isBlank()) {
            return Optional.empty();
        }

        boolean filterByGitType = gitType != null && !gitType.isBlank();
        anonymousRepoLog.info("Finding anonymous deployment by snowName: {} with gitType filter: {}",
                snowName, filterByGitType ? gitType : "none");

        if (filterByGitType) {
            return jpaRepository.findFirstBySnowNameAndGitTypeOrderByCreatedAtDesc(snowName, gitType);
        }
        return jpaRepository.findFirstBySnowNameOrderByCreatedAtDesc(snowName);
    }

    public List<SnowDeploymentsAnonymous> findByFilters(String actorId, String snowType) {
        anonymousRepoLog.info("Finding anonymous deployments with filters - actorId: {}, snowType: {}", actorId, snowType);
        boolean allTypes = "ALL".equalsIgnoreCase(snowType);
        List<SnowDeploymentsAnonymous> results;
        if (actorId != null && !allTypes && snowType != null) {
            results = jpaRepository.findByActorIdAndSnowType(actorId, snowType);
        } else if (actorId != null) {
            results = jpaRepository.findByActorId(actorId);
        } else if (snowType != null && !allTypes) {
            results = jpaRepository.findBySnowType(snowType);
        } else {
            results = jpaRepository.findAll();
        }
        anonymousRepoLog.info("Found {} matching anonymous deployment records", results.size());
        return results;
    }

    public List<SnowDeploymentsAnonymous> findByRepository(List<String> repositories) {
        anonymousRepoLog.info("Searching for {} repositories: {}", repositories.size(), repositories);
        List<SnowDeploymentsAnonymous> results = jpaRepository.findByRepositoryIn(repositories);
        anonymousRepoLog.info("Found {} matching anonymous deployment records", results.size());
        return results;
    }

    public List<SnowDeploymentsAnonymous> listAll() {
        return jpaRepository.findAll();
    }

    public SnowDeploymentsAnonymous findById(Long id) {
        return jpaRepository.findById(id).orElse(null);
    }

    public int cleanDuplicateRecords() {
        anonymousRepoLog.info("Cleaning duplicate anonymous deployment records");
        int deletedCount = entityManager.createNativeQuery("""
                DELETE FROM connectors.snow_deployments_anonymous s1
                USING connectors.snow_deployments_anonymous s2
                WHERE s1.snow_deployment_id > s2.snow_deployment_id
                AND s1.repository_owner = s2.repository_owner
                """).executeUpdate();
        anonymousRepoLog.info("Successfully deleted {} duplicate records", deletedCount);
        return deletedCount;
    }

    public void persistAllInBatch(List<SnowDeploymentsAnonymous> resultRecords) {
        anonymousRepoLog.info("Persisting batch of {} anonymous deployment records", resultRecords.size());
        jpaRepository.saveAll(resultRecords);
        for (SnowDeploymentsAnonymous saved : resultRecords) {
            System.out.println("Database insert connectors.snow_deployments_anonymous: id="
                    + saved.getSnowDeploymentId()
                    + ", snowName=" + saved.getSnowName()
                    + ", snowType=" + saved.getSnowType()
                    + ", repository=" + saved.getRepository()
                    + ", actorId=" + saved.getActorId());
        }
        anonymousRepoLog.info("Successfully persisted {} anonymous deployment records", resultRecords.size());
    }

    @Transactional
    public void truncateTable() {
        anonymousRepoLog.info("Truncating snow_deployments_anonymous table");
        entityManager.createNativeQuery("TRUNCATE TABLE connectors.snow_deployments_anonymous RESTART IDENTITY CASCADE")
                .executeUpdate();
        anonymousRepoLog.info("Successfully truncated snow_deployments_anonymous table");
    }

    @Transactional
    public boolean updateColor(Long snowDeploymentId, String color) {
        anonymousRepoLog.info("Updating color for deployment ID: {} to: {}", snowDeploymentId, color);

        SnowDeploymentsAnonymous deployment = findById(snowDeploymentId);
        if (deployment == null) {
            anonymousRepoLog.warn("Deployment not found with ID: {}", snowDeploymentId);
            return false;
        }

        if ("nocolor".equals(color)) {
            color = "";
        }
        deployment.setColor(color);
        jpaRepository.save(deployment);
        anonymousRepoLog.info("Successfully updated color for deployment ID: {}", snowDeploymentId);
        return true;
    }

    @Transactional
    public boolean updateLivenessType(Long snowDeploymentId, String livenessType) {
        anonymousRepoLog.info("Updating liveness type for deployment ID: {} to: {}", snowDeploymentId, livenessType);

        SnowDeploymentsAnonymous deployment = findById(snowDeploymentId);
        if (deployment == null) {
            anonymousRepoLog.warn("Deployment not found with ID: {}", snowDeploymentId);
            return false;
        }

        deployment.setLivenessType(livenessType);
        jpaRepository.save(deployment);
        anonymousRepoLog.info("Successfully updated liveness type for deployment ID: {}", snowDeploymentId);
        return true;
    }

    @Transactional
    public boolean updateLivenessStatus(Long snowDeploymentId, String livenessStatus) {
        anonymousRepoLog.info("Updating liveness status for deployment ID: {} to: {}", snowDeploymentId, livenessStatus);

        SnowDeploymentsAnonymous deployment = findById(snowDeploymentId);
        if (deployment == null) {
            anonymousRepoLog.warn("Deployment not found with ID: {}", snowDeploymentId);
            return false;
        }

        deployment.setLivenessStatus(livenessStatus);
        jpaRepository.save(deployment);
        anonymousRepoLog.info("Successfully updated liveness status for deployment ID: {}", snowDeploymentId);
        return true;
    }

    @Transactional
    public boolean updateLivenessStatusByRepository(String repository, String livenessStatus) {
        anonymousRepoLog.info("Updating liveness status for repository: {} to: {}", repository, livenessStatus);

        List<SnowDeploymentsAnonymous> deployments = jpaRepository.findByRepository(repository);
        if (deployments == null || deployments.isEmpty()) {
            anonymousRepoLog.warn("Deployment not found for repository: {}", repository);
            return false;
        }

        for (SnowDeploymentsAnonymous deployment : deployments) {
            deployment.setLivenessStatus(livenessStatus);
            jpaRepository.save(deployment);
        }

        anonymousRepoLog.info("Successfully updated liveness status for repository: {} ({} records)", repository, deployments.size());
        return true;
    }

    @Transactional
    public boolean updateLivenessStatusAndLivenessResponseByRepository(String repository, String livenessStatus, String livenessResponse) {
        anonymousRepoLog.info("Updating liveness status and liveness response for repository: {}", repository);

        List<SnowDeploymentsAnonymous> deployments = jpaRepository.findByRepository(repository);
        if (deployments == null || deployments.isEmpty()) {
            anonymousRepoLog.warn("Deployment not found for repository: {}", repository);
            return false;
        }

        String responseValue = livenessResponse != null ? livenessResponse : "";
        for (SnowDeploymentsAnonymous deployment : deployments) {
            deployment.setLivenessStatus(livenessStatus);
            deployment.setLivenessResponse(responseValue);
            jpaRepository.save(deployment);
        }

        anonymousRepoLog.info("Successfully updated liveness status and response for repository: {} ({} records)", repository, deployments.size());
        return true;
    }
}
