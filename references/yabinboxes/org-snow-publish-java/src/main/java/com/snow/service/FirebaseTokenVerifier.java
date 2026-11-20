package com.snow.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FirebaseTokenVerifier {

    private static final Logger firebaseTokenLog = LoggerFactory.getLogger("firebase-token-verifier");
    private static final String BEARER_PREFIX = "Bearer ";

    public Optional<FirebaseToken> verify(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            firebaseTokenLog.debug("Firebase token verified for uid: {}", decodedToken.getUid());
            return Optional.of(decodedToken);
        } catch (FirebaseAuthException exception) {
            firebaseTokenLog.warn("Firebase token verification failed: {}", exception.getMessage());
            return Optional.empty();
        }
    }

    public Optional<String> extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return Optional.empty();
        }
        if (!authorizationHeader.regionMatches(true, 0, BEARER_PREFIX, 0, BEARER_PREFIX.length())) {
            return Optional.empty();
        }
        String token = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        return token.isEmpty() ? Optional.empty() : Optional.of(token);
    }
}
