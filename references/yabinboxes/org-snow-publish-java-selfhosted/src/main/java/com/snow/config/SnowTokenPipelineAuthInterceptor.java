package com.snow.config;

import com.snow.service.SnowTokenPipelineVerifier;
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
public class SnowTokenPipelineAuthInterceptor implements HandlerInterceptor {

    private static final Logger snowTokenPipelineAuthLog =
            LoggerFactory.getLogger("snow-token-pipeline-auth-interceptor");

    private final SnowTokenPipelineVerifier snowTokenPipelineVerifier;
    private final boolean tokenValidationEnabled;

    public SnowTokenPipelineAuthInterceptor(
            SnowTokenPipelineVerifier snowTokenPipelineVerifier,
            @Value("${snow.auth.token-validation-enabled:true}") boolean tokenValidationEnabled) {
        this.snowTokenPipelineVerifier = snowTokenPipelineVerifier;
        this.tokenValidationEnabled = tokenValidationEnabled;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (WebConfig.isPublishPath(request) && !"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (!tokenValidationEnabled) {
            snowTokenPipelineAuthLog.debug(
                    "Skipping snowTokenPipeline Bearer validation (snow.auth.token-validation-enabled=false): {} {}",
                    request.getMethod(),
                    request.getRequestURI());
            return true;
        }

        Optional<String> bearerToken = snowTokenPipelineVerifier.extractBearerToken(request.getHeader("Authorization"));
        if (bearerToken.isEmpty() || !snowTokenPipelineVerifier.verify(bearerToken.get())) {
            snowTokenPipelineAuthLog.warn(
                    "Rejected request because snowTokenPipeline Bearer verification failed: {} {}",
                    request.getMethod(),
                    request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"Invalid or missing snowTokenPipeline Bearer token\"}");
            return false;
        }

        return true;
    }
}
