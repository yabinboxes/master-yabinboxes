package com.snow.config;

import com.snow.service.FirebaseTokenVerifier;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class FirebaseAuthInterceptor implements HandlerInterceptor {

    private static final Logger firebaseAuthLog = LoggerFactory.getLogger("firebase-auth-interceptor");

    private final FirebaseTokenVerifier firebaseTokenVerifier;
    private final boolean tokenValidationEnabled;

    public FirebaseAuthInterceptor(
            FirebaseTokenVerifier firebaseTokenVerifier,
            @Value("${snow.auth.token-validation-enabled:true}") boolean tokenValidationEnabled) {
        this.firebaseTokenVerifier = firebaseTokenVerifier;
        this.tokenValidationEnabled = tokenValidationEnabled;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (WebConfig.isPublishPath(request) && "POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (!tokenValidationEnabled) {
            firebaseAuthLog.debug(
                    "Skipping Firebase Bearer validation (snow.auth.token-validation-enabled=false): {} {}",
                    request.getMethod(),
                    request.getRequestURI());
            return true;
        }

        Optional<String> bearerToken = firebaseTokenVerifier.extractBearerToken(request.getHeader("Authorization"));
        if (bearerToken.isEmpty() || firebaseTokenVerifier.verify(bearerToken.get()).isEmpty()) {
            firebaseAuthLog.warn(
                    "Rejected request because Firebase Bearer token verification failed: {} {}",
                    request.getMethod(),
                    request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"Invalid or expired Firebase ID token\"}");
            return false;
        }

        return true;
    }
}
