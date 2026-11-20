package com.snow.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.time.OffsetDateTime;

@Data
@ToString
@Entity
@Table(name = "data_source_snow_deployments_volatile", schema = "connectors")
public class DataSourceSnowDeploymentsVolatile {

    @Id
    @Column(name = "snow_deployment_id")
    private Long snowDeploymentId;

    @Column(name = "snow_token")
    private String snowToken;

    @Column(name = "actor")
    private String actor;

    @Column(name = "actor_id")
    private String actorId;

    @Column(name = "email")
    private String email;

    @Column(name = "snow_type")
    private String snowType;

    @Column(name = "sha")
    private String sha;

    @Column(name = "git_type")
    private String gitType;

    @Column(name = "snow_name")
    private String snowName;

    @Column(name = "provider")
    private String provider;

    @Column(name = "repository_owner")
    private String repositoryOwner;

    @Column(name = "repository")
    private String repository;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "payload")
    private String payload;

    @Column(name = "url")
    private String url;

    @Column(name = "environment")
    private String environment;

    @Column(name = "url_path")
    private String urlPath;

    @Column(name = "tab_name")
    private String tabName;

    @Column(name = "tab_id")
    private int tabId;

    @Column(name = "port")
    private String port;

    @Column(name = "image")
    private String image;

    @Column(name = "registry")
    private String registry;

    @Column(name = "notes")
    private String notes;

    @Column(name = "processed")
    private int processed;

    @Column(name = "extras")
    private String extras;

    @Column(name = "description")
    private String description;

    @Column(name = "health_check_url")
    private String healthCheckUrl;

    @Column(name = "health_check_time")
    private String healthCheckTime;

    @Column(name = "liveness_type")
    private String livenessType;

    @Column(name = "liveness_status")
    private String livenessStatus;

    @Column(name = "liveness_response")
    private String livenessResponse;

    @Column(name = "terraform_output", columnDefinition = "text")
    private String terraformOutput;

    @Column(name = "terraform_vars", columnDefinition = "text")
    private String terraformVars;

    @Column(name = "docker_output", columnDefinition = "text")
    private String dockerOutput;

    @Column(name = "docker_vars", columnDefinition = "text")
    private String dockerVars;

    @Column(name = "license")
    private String license;
}
