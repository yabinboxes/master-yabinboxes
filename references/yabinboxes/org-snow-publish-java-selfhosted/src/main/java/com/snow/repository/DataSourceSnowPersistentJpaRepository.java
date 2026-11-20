package com.snow.repository;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataSourceSnowPersistentJpaRepository extends JpaRepository<DataSourceSnowDeploymentsPersistent, Long> {
}
