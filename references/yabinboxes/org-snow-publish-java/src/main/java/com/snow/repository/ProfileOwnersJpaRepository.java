package com.snow.repository;

import com.snow.model.ProfileOwners;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileOwnersJpaRepository extends JpaRepository<ProfileOwners, Long> {

    Optional<ProfileOwners> findByEmail(String email);

    Optional<ProfileOwners> findBySnowTokenPipeline(String snowTokenPipeline);

    @Query("""
            SELECT p FROM ProfileOwners p
            WHERE p.actorId = :actorId
            AND (:gitType IS NULL OR :gitType = '' OR p.gitType = :gitType)
            ORDER BY p.profileId DESC
            """)
    Optional<ProfileOwners> findFirstByActorIdOrderByProfileIdDesc(
            @Param("actorId") String actorId, @Param("gitType") String gitType);
}
