package com.snow.repository;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class DataSourceSnowPersistentRepository {

    private static final Logger persistentRepoLog = LoggerFactory.getLogger("persistent-repository");

    @PersistenceContext
    private EntityManager entityManager;

    private final DataSourceSnowPersistentJpaRepository jpaRepository;

    public DataSourceSnowPersistentRepository(DataSourceSnowPersistentJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    public DataSourceSnowDeploymentsPersistent saveAndFlush(DataSourceSnowDeploymentsPersistent entity) {
        DataSourceSnowDeploymentsPersistent saved = jpaRepository.saveAndFlush(entity);
        System.out.println("Database insert connectors.data_source_snow_deployments_persistent: id="
                + saved.getSnowDeploymentId()
                + ", snowName=" + saved.getSnowName()
                + ", snowType=" + saved.getSnowType()
                + ", repository=" + saved.getRepository()
                + ", actorId=" + saved.getActorId());
        return saved;
    }

    public DataSourceSnowDeploymentsPersistent save(DataSourceSnowDeploymentsPersistent entity) {
        return jpaRepository.save(entity);
    }

    public DataSourceSnowDeploymentsPersistent findById(Long id) {
        return jpaRepository.findById(id).orElse(null);
    }

    public List<DataSourceSnowDeploymentsPersistent> findAll() {
        persistentRepoLog.info("Retrieving all records from data_source_snow_deployments_persistent");
        List<DataSourceSnowDeploymentsPersistent> records = jpaRepository.findAll();
        persistentRepoLog.info("Retrieved {} records from persistent table", records.size());
        return records;
    }

    public void persistAllInBatch(List<DataSourceSnowDeploymentsPersistent> processed) {
        persistentRepoLog.info("Persisting batch of {} records to persistent table", processed.size());
        jpaRepository.saveAll(processed);
        for (DataSourceSnowDeploymentsPersistent saved : processed) {
            System.out.println("Database insert connectors.data_source_snow_deployments_persistent: id="
                    + saved.getSnowDeploymentId()
                    + ", snowName=" + saved.getSnowName()
                    + ", snowType=" + saved.getSnowType()
                    + ", repository=" + saved.getRepository()
                    + ", actorId=" + saved.getActorId());
        }
        persistentRepoLog.info("Successfully persisted {} records to persistent table", processed.size());
    }

    public void updateProcessedRecords(List<DataSourceSnowDeploymentsPersistent> processed) {
        persistentRepoLog.info("Updating {} records as processed in persistent table", processed.size());

        processed.forEach(p -> {
            DataSourceSnowDeploymentsPersistent data = findById(p.getSnowDeploymentId());
            if (data != null) {
                persistentRepoLog.info("Updating record ID: {} as processed", p.getSnowDeploymentId());
                data.setProcessed(1);
                jpaRepository.save(data);
            } else {
                persistentRepoLog.warn("Record ID: {} not found, skipping update", p.getSnowDeploymentId());
            }
        });

        persistentRepoLog.info("Completed updating processed records");
    }

    @Transactional
    public void truncateTable() {
        persistentRepoLog.info("Truncating data_source_snow_deployments_persistent table");
        entityManager.createNativeQuery("TRUNCATE TABLE connectors.data_source_snow_deployments_persistent RESTART IDENTITY CASCADE")
                .executeUpdate();
        persistentRepoLog.info("Successfully truncated data_source_snow_deployments_persistent table");
    }
}
