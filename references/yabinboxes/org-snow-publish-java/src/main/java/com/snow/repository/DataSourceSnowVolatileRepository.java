package com.snow.repository;

import com.snow.model.DataSourceSnowDeploymentsVolatile;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class DataSourceSnowVolatileRepository {

    private static final Logger volatileRepoLog = LoggerFactory.getLogger("volatile-repository");

    @PersistenceContext
    private EntityManager entityManager;

    private final DataSourceSnowVolatileJpaRepository jpaRepository;

    public DataSourceSnowVolatileRepository(DataSourceSnowVolatileJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    public DataSourceSnowDeploymentsVolatile save(DataSourceSnowDeploymentsVolatile entity) {
        DataSourceSnowDeploymentsVolatile saved = jpaRepository.save(entity);
        System.out.println("Database insert connectors.data_source_snow_deployments_volatile: id="
                + saved.getSnowDeploymentId()
                + ", snowName=" + saved.getSnowName()
                + ", snowType=" + saved.getSnowType()
                + ", repository=" + saved.getRepository()
                + ", actorId=" + saved.getActorId());
        return saved;
    }

    public List<DataSourceSnowDeploymentsVolatile> findBatchRecords(int limit) {
        volatileRepoLog.info("Finding batch of {} records from volatile table", limit);
        List<DataSourceSnowDeploymentsVolatile> records = jpaRepository.findAllBy(PageRequest.of(0, limit));
        volatileRepoLog.info("Retrieved {} records from volatile table", records.size());
        return records;
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        volatileRepoLog.info("Deleting {} records from volatile table by IDs: {}", ids.size(), ids);
        jpaRepository.deleteBySnowDeploymentIdIn(ids);
        volatileRepoLog.info("Successfully deleted records from volatile table");
    }

    public List<DataSourceSnowDeploymentsVolatile> findByLivenessType(String livenessType) {
        volatileRepoLog.info("Finding records by liveness_type: {}", livenessType);
        @SuppressWarnings("unchecked")
        List<DataSourceSnowDeploymentsVolatile> results = entityManager.createNativeQuery(
                        "SELECT * FROM connectors.data_source_snow_deployments_volatile WHERE liveness_type = ?1",
                        DataSourceSnowDeploymentsVolatile.class)
                .setParameter(1, livenessType)
                .getResultList();
        return results;
    }

    @Transactional
    public void truncateTable() {
        volatileRepoLog.info("Truncating data_source_snow_deployments_volatile table");
        entityManager.createNativeQuery("TRUNCATE TABLE connectors.data_source_snow_deployments_volatile RESTART IDENTITY CASCADE")
                .executeUpdate();
        volatileRepoLog.info("Successfully truncated data_source_snow_deployments_volatile table");
    }
}
