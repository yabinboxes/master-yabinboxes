package com.snow.repository;

import com.snow.model.ProfileOwners;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class ProfileOwnersRepository {

    private static final Logger profileOwnersRepoLog = LoggerFactory.getLogger("profile-owners-repository");

    @PersistenceContext
    private EntityManager entityManager;

    private final ProfileOwnersJpaRepository jpaRepository;

    public ProfileOwnersRepository(ProfileOwnersJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    public Optional<ProfileOwners> findByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    public ProfileOwners getProfileByEmail(String email) {
        profileOwnersRepoLog.info("Searching for profile by email: {}", email);
        Optional<ProfileOwners> profile = jpaRepository.findByEmail(email);
        if (profile.isPresent()) {
            profileOwnersRepoLog.info("Found profile with ID: {} for email: {}", profile.get().getProfileId(), email);
            return profile.get();
        }
        profileOwnersRepoLog.info("Profile not found for email: {}", email);
        return null;
    }

    public ProfileOwners getProfileByActorId(String actorId, String gitType) {
        profileOwnersRepoLog.info("Searching for profile by actorId: {}, gitType: {}", actorId, gitType);
        Optional<ProfileOwners> profile = jpaRepository.findFirstByActorIdOrderByProfileIdDesc(actorId, gitType);
        if (profile.isPresent()) {
            profileOwnersRepoLog.info("Found profile with ID: {} for actorId: {}", profile.get().getProfileId(), actorId);
            return profile.get();
        }
        profileOwnersRepoLog.info("Profile not found for actorId: {}", actorId);
        return null;
    }

    public Optional<ProfileOwners> findBySnowTokenPipeline(String snowTokenPipeline) {
        return jpaRepository.findBySnowTokenPipeline(snowTokenPipeline);
    }

    public ProfileOwners saveAndFlush(ProfileOwners profile) {
        ProfileOwners saved = jpaRepository.saveAndFlush(profile);
        System.out.println("Database insert connectors.profile_owners: profileId="
                + saved.getProfileId()
                + ", email=" + saved.getEmail()
                + ", actorId=" + saved.getActorId()
                + ", gitType=" + saved.getGitType());
        return saved;
    }

    public ProfileOwners save(ProfileOwners profile) {
        return jpaRepository.save(profile);
    }

    public List<ProfileOwners> findAll() {
        profileOwnersRepoLog.info("Reading all records from profile_owners");
        List<ProfileOwners> profiles = jpaRepository.findAll();
        profileOwnersRepoLog.info("Found {} profile records", profiles.size());
        return profiles;
    }

    @Transactional
    public void truncateTable() {
        profileOwnersRepoLog.info("Truncating profile_owners table");
        entityManager.createNativeQuery("TRUNCATE TABLE connectors.profile_owners RESTART IDENTITY CASCADE")
                .executeUpdate();
        profileOwnersRepoLog.info("Successfully truncated profile_owners table");
    }
}
