package com.snow.repository;

import com.snow.model.DataSourceSnowDeploymentsVolatile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataSourceSnowVolatileJpaRepository extends JpaRepository<DataSourceSnowDeploymentsVolatile, Long> {

    List<DataSourceSnowDeploymentsVolatile> findAllBy(Pageable pageable);

    @Modifying
    @Query("DELETE FROM DataSourceSnowDeploymentsVolatile v WHERE v.snowDeploymentId IN :ids")
    void deleteBySnowDeploymentIdIn(@Param("ids") List<Long> ids);
}
