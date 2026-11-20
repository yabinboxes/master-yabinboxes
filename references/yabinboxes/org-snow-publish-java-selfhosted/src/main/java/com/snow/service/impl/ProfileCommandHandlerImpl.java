package com.snow.service.impl;

import com.snow.entity.ProfileQuery;
import com.snow.model.ProfileOwners;
import com.snow.repository.ProfileOwnersRepository;
import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.snow.service.ProfileCommandHandler;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileCommandHandlerImpl implements ProfileCommandHandler {

    private static final Logger profileHandlerLog = LoggerFactory.getLogger("profile-command-handler");

    private final ProfileOwnersRepository profileOwnersRepository;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;

    public ProfileCommandHandlerImpl(
            ProfileOwnersRepository profileOwnersRepository,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository) {
        this.profileOwnersRepository = profileOwnersRepository;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
    }

    @Override
    @Transactional
    public synchronized ProfileQuery getProfile(ProfileQuery eProfileQuery) {
        profileHandlerLog.info("Processing profile query request");
        profileHandlerLog.info("Searching for profile with email: {}", eProfileQuery.getEmail());

        Optional<ProfileOwners> existingProfile = profileOwnersRepository.findByEmail(eProfileQuery.getEmail());
        ProfileOwners profileOwners;

        if (existingProfile.isPresent()) {
            profileHandlerLog.info("Found existing profile for email: {}", eProfileQuery.getEmail());
            profileOwners = existingProfile.get();
            boolean updated = false;
            if (eProfileQuery.getActor() != null && !eProfileQuery.getActor().isEmpty()) {
                profileHandlerLog.info("Updating actor for profile ID: {}", profileOwners.getProfileId());
                profileOwners.setActor(eProfileQuery.getActor());
                updated = true;
            }
            if (eProfileQuery.getActorId() != null && !eProfileQuery.getActorId().isEmpty()) {
                profileHandlerLog.info("Updating actorId for profile ID: {}", profileOwners.getProfileId());
                profileOwners.setActorId(eProfileQuery.getActorId());
                updated = true;
            }
            if (eProfileQuery.getGitType() != null && !eProfileQuery.getGitType().isEmpty()) {
                profileHandlerLog.info("Updating gitType for profile ID: {}", profileOwners.getProfileId());
                profileOwners.setGitType(eProfileQuery.getGitType());
                updated = true;
            }
            if (updated) {
                profileOwnersRepository.save(profileOwners);
            } else {
                profileHandlerLog.info("Retrieved existing profile with ID: {} without updates", profileOwners.getProfileId());
            }
        } else {
            profileHandlerLog.info("Profile not found for email: {}, creating new profile", eProfileQuery.getEmail());

            profileOwners = new ProfileOwners();
            profileOwners.setEmail(eProfileQuery.getEmail());
            profileOwners.setActor(normalizeText(eProfileQuery.getActor()));
            profileOwners.setActorId(normalizeText(eProfileQuery.getActorId()));
            profileOwners.setGitType(normalizeText(eProfileQuery.getGitType()));
            String generatedToken = compactUuid();
            profileOwners.setSnowToken(generatedToken);
            profileOwners.setLicense("self");
            profileOwners.setOrg("");
            if (profileOwners.getSnowTokenPipeline() == null) {
                profileOwners.setSnowTokenPipeline("");
            }

            profileOwnersRepository.saveAndFlush(profileOwners);
            profileOwners.setSnowTokenPipeline(createJwtWithSecret(generatedToken, profileOwners));
            profileOwnersRepository.save(profileOwners);
            profileHandlerLog.info("Created new profile with ID: {} with generated UUIDs", profileOwners.getProfileId());

            profileSnowDeploymentsRepository.createTableIfNotExists(profileOwners.getProfileId());
        }

        ProfileQuery result = new ProfileQuery(
                profileOwners.getEmail(),
                profileOwners.getActor(),
                profileOwners.getActorId(),
                profileOwners.getGitType(),
                profileOwners.getSnowToken(),
                profileOwners.getLicense(),
                profileOwners.getOrg()
        );

        profileHandlerLog.info("Returning profile for email: {}", result.getEmail());
        return result;
    }

    @Override
    @Transactional
    public ProfileQuery modifyProfile(ProfileQuery eProfileQuery) {
        profileHandlerLog.info("Processing profile modification request");
        profileHandlerLog.info("Searching for profile with email: {}", eProfileQuery.getEmail());

        if (eProfileQuery.getEmail() == null || eProfileQuery.getEmail().isEmpty()) {
            profileHandlerLog.error("Email is required for profile modification");
            return null;
        }

        Optional<ProfileOwners> existingProfile = profileOwnersRepository.findByEmail(eProfileQuery.getEmail());
        if (existingProfile.isEmpty()) {
            profileHandlerLog.warn("Profile not found for email: {} - cannot modify", eProfileQuery.getEmail());
            return null;
        }

        ProfileOwners profileOwners = existingProfile.get();
        profileHandlerLog.info("Found existing profile with ID: {} for modification", profileOwners.getProfileId());

        boolean updated = false;

        if (eProfileQuery.getActor() != null && !eProfileQuery.getActor().isEmpty()) {
            profileHandlerLog.info("Updating actor for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setActor(eProfileQuery.getActor());
            updated = true;
        }

        if (eProfileQuery.getActorId() != null && !eProfileQuery.getActorId().isEmpty()) {
            profileHandlerLog.info("Updating actorId for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setActorId(eProfileQuery.getActorId());
            updated = true;
        }

        if (eProfileQuery.getGitType() != null && !eProfileQuery.getGitType().isEmpty()) {
            profileHandlerLog.info("Updating gitType for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setGitType(eProfileQuery.getGitType());
            updated = true;
        }

        if (eProfileQuery.getSnowToken() != null && !eProfileQuery.getSnowToken().isEmpty()) {
            profileHandlerLog.info("Updating snowToken for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setSnowToken(eProfileQuery.getSnowToken());
            updated = true;
        }

        if (eProfileQuery.getLicense() != null && !eProfileQuery.getLicense().isEmpty()) {
            profileHandlerLog.info("Updating license for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setLicense(eProfileQuery.getLicense());
            updated = true;
        }

        if (eProfileQuery.getOrg() != null && !eProfileQuery.getOrg().isEmpty()) {
            profileHandlerLog.info("Updating org for profile ID: {}", profileOwners.getProfileId());
            profileOwners.setOrg(eProfileQuery.getOrg());
            updated = true;
        }

        if (updated) {
            profileOwnersRepository.save(profileOwners);
            profileHandlerLog.info("Successfully updated profile with ID: {}", profileOwners.getProfileId());
        } else {
            profileHandlerLog.info("No fields to update for profile ID: {}", profileOwners.getProfileId());
        }

        return new ProfileQuery(
                profileOwners.getEmail(),
                profileOwners.getActor(),
                profileOwners.getActorId(),
                profileOwners.getGitType(),
                profileOwners.getSnowToken(),
                profileOwners.getLicense(),
                profileOwners.getOrg()
        );
    }

    @Override
    public String getSnowTokenPipeline(String actorId, String gitType) {
        profileHandlerLog.info("Retrieving snowTokenPipeline for actorId: {}, gitType: {}", actorId, gitType);
        ProfileOwners profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
        if (profile == null) {
            profileHandlerLog.warn("Profile not found for actorId: {}, gitType: {}", actorId, gitType);
            return null;
        }
        profileHandlerLog.info("Found snowTokenPipeline for profile ID: {}", profile.getProfileId());
        String snowTokenPipeline = profile.getSnowTokenPipeline();
        if (snowTokenPipeline == null) {
            snowTokenPipeline = "";
        }
        return snowTokenPipeline;
    }

    @Override
    @Transactional
    public String regenerateSnowTokenPipeline(String actorId, String gitType) {
        profileHandlerLog.info("Regenerating snowTokenPipeline for actorId: {}, gitType: {}", actorId, gitType);
        ProfileOwners profile = profileOwnersRepository.getProfileByActorId(actorId, gitType);
        if (profile == null) {
            profileHandlerLog.warn("Profile not found for actorId: {}, gitType: {} - cannot regenerate snowTokenPipeline",
                    actorId, gitType);
            return null;
        }

        String snowToken = compactUuid();
        String snowTokenPipeline = createJwtWithSecret(snowToken, profile);
        profile.setSnowToken(snowToken);
        profile.setSnowTokenPipeline(snowTokenPipeline);
        profileOwnersRepository.save(profile);
        profileHandlerLog.info("Successfully regenerated snowTokenPipeline for profile ID: {}", profile.getProfileId());
        return snowTokenPipeline;
    }

    private static String normalizeText(String value) {
        return value != null ? value : "";
    }

    private static String compactUuid() {
        return UUID.randomUUID().toString()
                .replace("-", "")
                .replace(" ", "");
    }

    private static String createJwtWithSecret(String snowToken, ProfileOwners profile) {
        SecretKey key = Keys.hmacShaKeyFor(sha256(snowToken));
        return Jwts.builder()
                .subject(normalizeText(profile.getActorId()))
                .claim("gitType", normalizeText(profile.getGitType()))
                .issuedAt(new Date())
                .signWith(key)
                .compact();
    }

    private static byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
