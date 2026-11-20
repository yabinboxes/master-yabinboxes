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
