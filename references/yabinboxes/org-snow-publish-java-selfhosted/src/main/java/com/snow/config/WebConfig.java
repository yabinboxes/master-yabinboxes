package com.snow.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    static final String PUBLISH_PATH = "/connectors/publish-snow-deployment";
    static final String GET_SNOW_URL_PATH = "/connectors/get-snow-url";

    static String requestPath(HttpServletRequest request) {
        String path = request.getServletPath();
        return (path == null || path.isEmpty()) ? request.getRequestURI() : path;
    }

    static boolean isPublishPath(HttpServletRequest request) {
        return PUBLISH_PATH.equals(requestPath(request));
    }

    private final SnowTokenPipelineAuthInterceptor snowTokenPipelineAuthInterceptor;

    public WebConfig(SnowTokenPipelineAuthInterceptor snowTokenPipelineAuthInterceptor) {
        this.snowTokenPipelineAuthInterceptor = snowTokenPipelineAuthInterceptor;
    }

    /**
     * Early CorsFilter so OPTIONS preflight succeeds before MVC/interceptors.
     * Allows all origins, methods, and headers (including Authorization).
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        FilterRegistrationBean<CorsFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new CorsFilter(corsConfigurationSource()));
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registration.addUrlPatterns("/*");
        return registration;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(List.of("*"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(snowTokenPipelineAuthInterceptor)
                .addPathPatterns(PUBLISH_PATH, GET_SNOW_URL_PATH);
    }
}