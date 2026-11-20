package com.snow.repository;

import com.snow.model.SnowDeploymentsAnonymous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SnowDeploymentsAnonymousJpaRepository extends JpaRepository<SnowDeploymentsAnonymous, Long> {

    Optional<SnowDeploymentsAnonymous> findFirstBySnowName(String snowName);

    Optional<SnowDeploymentsAnonymous> findFirstBySnowNameOrderByCreatedAtDesc(String snowName);

    Optional<SnowDeploymentsAnonymous> findFirstBySnowNameAndGitTypeOrderByCreatedAtDesc(String snowName, String gitType);

    List<SnowDeploymentsAnonymous> findByActorId(String actorId);

    List<SnowDeploymentsAnonymous> findByActorIdAndSnowType(String actorId, String snowType);

    List<SnowDeploymentsAnonymous> findBySnowType(String snowType);

    List<SnowDeploymentsAnonymous> findByRepository(String repository);

    List<SnowDeploymentsAnonymous> findByRepositoryIn(List<String> repositories);
}
