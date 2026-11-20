package com.snow.service;

import com.snow.model.ProfileOwners;
import com.snow.repository.ProfileOwnersRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class SnowTokenPipelineVerifier {

    private static final Logger snowTokenPipelineLog = LoggerFactory.getLogger("snow-token-pipeline-verifier");

    private final ProfileOwnersRepository profileOwnersRepository;

    public SnowTokenPipelineVerifier(ProfileOwnersRepository profileOwnersRepository) {
        this.profileOwnersRepository = profileOwnersRepository;
    }

    /**
     * Verifies a Bearer snowTokenPipeline JWT using profile_owners.snow_token as the HMAC secret.
     * Profile is resolved by snow_token_pipeline match, or by JWT claims (sub / gitType).
     */
    public boolean verify(String snowTokenPipeline) {
        if (snowTokenPipeline == null || snowTokenPipeline.isBlank()) {
            return false;
        }

        Optional<ProfileOwners> profile = profileOwnersRepository.findBySnowTokenPipeline(snowTokenPipeline);
        if (profile.isEmpty()) {
            profile = resolveProfileFromClaims(snowTokenPipeline);
        }
        if (profile.isEmpty()) {
            snowTokenPipelineLog.warn("No profile_owners row found for snowTokenPipeline Bearer token");
            return false;
        }

        String snowToken = profile.get().getSnowToken();
        if (snowToken == null || snowToken.isBlank()) {
            snowTokenPipelineLog.warn(
                    "Profile ID {} has empty snowToken; cannot verify snowTokenPipeline",
                    profile.get().getProfileId());
            return false;
        }

        try {
            SecretKey key = Keys.hmacShaKeyFor(sha256(snowToken));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(snowTokenPipeline)
                    .getPayload();

            String subject = claims.getSubject();
            if (subject == null || !subject.equals(normalize(profile.get().getActorId()))) {
                snowTokenPipelineLog.warn(
                        "snowTokenPipeline subject does not match profile actorId for profile ID {}",
                        profile.get().getProfileId());
                return false;
            }

            snowTokenPipelineLog.debug(
                    "snowTokenPipeline verified for profile ID {}",
                    profile.get().getProfileId());
            return true;
        } catch (Exception exception) {
            snowTokenPipelineLog.warn("snowTokenPipeline verification failed: {}", exception.getMessage());
            return false;
        }
    }

    private Optional<ProfileOwners> resolveProfileFromClaims(String snowTokenPipeline) {
        try {
            String[] parts = snowTokenPipeline.split("\\.");
            if (parts.length < 2) {
                return Optional.empty();
            }
            String json = new String(Base64.getUrlDecoder().decode(padBase64(parts[1])), StandardCharsets.UTF_8);
            String actorId = readJsonString(json, "sub");
            String gitType = readJsonString(json, "gitType");
            if (actorId == null || actorId.isBlank()) {
                return Optional.empty();
            }
            return Optional.ofNullable(profileOwnersRepository.getProfileByActorId(actorId, gitType));
        } catch (Exception exception) {
            snowTokenPipelineLog.warn(
                    "Failed to resolve profile from snowTokenPipeline claims: {}",
                    exception.getMessage());
            return Optional.empty();
        }
    }

    private static String padBase64(String value) {
        int remainder = value.length() % 4;
        if (remainder == 0) {
            return value;
        }
        return value + "====".substring(remainder);
    }

    private static String readJsonString(String json, String field) {
        String needle = "\"" + field + "\"";
        int fieldIndex = json.indexOf(needle);
        if (fieldIndex < 0) {
            return null;
        }
        int colon = json.indexOf(':', fieldIndex + needle.length());
        if (colon < 0) {
            return null;
        }
        int startQuote = json.indexOf('"', colon + 1);
        if (startQuote < 0) {
            return null;
        }
        int endQuote = json.indexOf('"', startQuote + 1);
        if (endQuote < 0) {
            return null;
        }
        return json.substring(startQuote + 1, endQuote);
    }

    private static String normalize(String value) {
        return value != null ? value : "";
    }

    private static byte[] sha256(String value) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
