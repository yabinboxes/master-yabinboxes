package com.snow.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.Objects;

@Data
@ToString
@Entity
@Table(name = "snow_deployments_anonymous", schema = "connectors")
@Schema(description = "Anonymous Snow deployment record. Contains deployment information without sensitive tokens.")
public class SnowDeploymentsAnonymous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "snow_deployment_id")
    @Schema(description = "Unique deployment identifier", example = "12345")
    private Long snowDeploymentId;

    @Column(name = "snow_type")
    @Schema(description = "Type of Snow deployment", example = "CLUSTER")
    private String snowType;

    @Column(name = "snow_name")
    @Schema(description = "Name of the Snow deployment", example = "my-snow-deployment")
    private String snowName;

    @Column(name = "git_type")
    @Schema(description = "Git repository type", example = "github")
    private String gitType;

    @Column(name = "provider")
    @Schema(description = "Cloud provider", example = "AWS")
    private String provider;

    @Column(name = "actor")
    @Schema(description = "Actor/user who initiated the deployment", example = "user@example.com")
    private String actor;

    @Column(name = "actor_id")
    @Schema(description = "User identifier", example = "usr_123")
    private String actorId;

    @Column(name = "repository_owner")
    @Schema(description = "Repository owner/organization", example = "myorg/myrepo")
    private String repositoryOwner;

    @Column(name = "repository")
    @Schema(description = "Repository key used for lookups (often mirrors owner)", example = "myorg/myrepo")
    private String repository;

    @Column(name = "created_at")
    @Schema(description = "Deployment creation timestamp")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    @Schema(description = "Deployment last update timestamp")
    private OffsetDateTime updatedAt;

    @Column(name = "status")
    @Schema(description = "Deployment status", example = "active")
    private String status;

    @Column(name = "url")
    @Schema(description = "Deployment URL", example = "https://example.com")
    private String url;

    @Column(name = "environment")
    @Schema(description = "Deployment environment", example = "production")
    private String environment;

    @Column(name = "url_path")
    @Schema(description = "URL path", example = "/api/v1")
    private String urlPath;

    @Column(name = "tab_name")
    @Schema(description = "Tab name", example = "overview")
    private String tabName;

    @Column(name = "tab_id")
    @Schema(description = "Tab id", example = "1")
    private int tabId;

    @Column(name = "port")
    @Schema(description = "Port number", example = "8080")
    private String port;

    @Column(name = "image")
    @Schema(description = "Container image name", example = "myapp:latest")
    private String image;

    @Column(name = "registry")
    @Schema(description = "Container registry URL", example = "docker.io")
    private String registry;

    @Column(name = "description")
    @Schema(description = "Deployment description")
    private String description;

    @Column(name = "extras")
    @Schema(description = "Extra configuration data")
    private String extras;

    @Column(name = "payload")
    @Schema(description = "Additional payload data in JSON format")
    private String payload;

    @Column(name = "health_check_url")
    @Schema(description = "Health check URL", example = "https://example.com/health")
    private String healthCheckUrl;

    @Column(name = "health_check_time")
    @Schema(description = "Health check interval time", example = "30s")
    private String healthCheckTime;

    @Column(name = "notes")
    @Schema(description = "Additional notes")
    private String notes;

    @Column(name = "email")
    @Schema(description = "Email address associated with the deployment", example = "user@example.com")
    private String email;

    @Column(name = "color")
    @Schema(description = "Color associated with the deployment", example = "blue")
    private String color;

    @Column(name = "liveness_type")
    @Schema(description = "Liveness probe type", example = "active")
    private String livenessType;

    @Column(name = "liveness_status")
    @Schema(description = "Liveness status", example = "active")
    private String livenessStatus;

    @Column(name = "liveness_response")
    @Schema(description = "Raw or summarized response from the liveness probe")
    private String livenessResponse;

    @Column(name = "terraform_output", columnDefinition = "text")
    @Schema(description = "Terraform output captured for this deployment")
    private String terraformOutput;

    @Column(name = "terraform_vars", columnDefinition = "text")
    @Schema(description = "Terraform variables captured for this deployment")
    private String terraformVars;

    @Column(name = "docker_output", columnDefinition = "text")
    @Schema(description = "Docker output captured for this deployment")
    private String dockerOutput;

    @Column(name = "docker_vars", columnDefinition = "text")
    @Schema(description = "Docker variables captured for this deployment")
    private String dockerVars;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SnowDeploymentsAnonymous that = (SnowDeploymentsAnonymous) o;
        return Objects.equals(repository, that.repository);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(repository);
    }
}
