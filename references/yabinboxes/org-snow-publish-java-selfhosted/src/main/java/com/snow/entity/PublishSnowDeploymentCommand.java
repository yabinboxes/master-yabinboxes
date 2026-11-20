package com.snow.entity;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Command to publish a Snow deployment. Contains all deployment metadata including tokens, repository information, and deployment configuration.")
public class PublishSnowDeploymentCommand {

    @Schema(description = "Actor/user who initiated the deployment", example = "user@example.com")
    private String actor;

    @NotBlank(message = "actorId is required")
    @Schema(description = "User identifier", example = "usr_123")
    private String actorId;

    @Schema(description = "Email address associated with the deployment", example = "user@example.com")
    private String email;

    @NotBlank(message = "snowType is required")
    @Schema(description = "Type of Snow deployment", requiredMode = Schema.RequiredMode.REQUIRED, example = "CLUSTER")
    private String snowType;

    @Schema(description = "Git commit SHA", example = "abc123def456")
    private String sha;

    @NotBlank(message = "gitType is required")
    @Schema(description = "Git repository type", requiredMode = Schema.RequiredMode.REQUIRED, example = "github")
    private String gitType;

    @NotBlank(message = "snowName is required")
    @Schema(description = "Name of the Snow deployment", requiredMode = Schema.RequiredMode.REQUIRED, example = "my-snow-deployment")
    private String snowName;

    @Schema(description = "Cloud provider", example = "AWS")
    private String provider;

    @NotBlank(message = "repository is required")
    @Schema(description = "Repository owner/organization", requiredMode = Schema.RequiredMode.REQUIRED, example = "myorg/myrepo")
    private String repository;

    @NotBlank(message = "repositoryOwner is required")
    @Schema(description = "Repository owner", requiredMode = Schema.RequiredMode.REQUIRED, example = "myorg")
    private String repositoryOwner;

    @Schema(description = "Deployment status", example = "active")
    private String status;

    @Schema(description = "Additional payload data in JSON format")
    private String payload;

    @Schema(description = "Deployment URL", example = "https://example.com")
    private String url;

    @Schema(description = "Deployment environment", example = "production")
    private String environment;

    @Schema(description = "URL path", example = "/api/v1")
    private String urlPath;

    @Schema(description = "Tab name", example = "overview")
    private String tabName;

    @Schema(description = "Tab id", example = "1")
    private int tabId;

    @Schema(description = "Port number", example = "8080")
    private String port;

    @Schema(description = "Container image name", example = "myapp:latest")
    private String image;

    @Schema(description = "Container registry URL", example = "docker.io")
    private String registry;

    @Schema(description = "Additional notes")
    private String notes;

    @Schema(description = "Processing status (0 = not processed, 1 = processed)", example = "0")
    private int processed;

    @Schema(description = "Extra configuration data")
    private String extras;

    @Schema(description = "Deployment description")
    private String description;

    @Schema(description = "Health check URL", example = "https://example.com/health")
    private String healthCheckUrl;

    @Schema(description = "Health check interval time", example = "30s")
    private String healthCheckTime;

    @Schema(description = "Liveness check type", example = "HTTP")
    private String livenessType;

    @Schema(description = "Liveness status", example = "active")
    private String livenessStatus;

    @Schema(description = "Raw or summarized response from the liveness probe")
    private String livenessResponse;

    @JsonDeserialize(using = TerraformOutputDeserializer.class)
    @Schema(description = "Terraform output captured for this deployment. A JSON object is stored as text.")
    private String terraformOutput;

    @JsonDeserialize(using = TerraformOutputDeserializer.class)
    @Schema(description = "Terraform variables captured for this deployment. A JSON object is stored as text.")
    private String terraformVars;

    @JsonDeserialize(using = TerraformOutputDeserializer.class)
    @Schema(description = "Docker output captured for this deployment. A JSON object is stored as text.")
    private String dockerOutput;

    @JsonDeserialize(using = TerraformOutputDeserializer.class)
    @Schema(description = "Docker variables captured for this deployment. A JSON object is stored as text.")
    private String dockerVars;

    public PublishSnowDeploymentCommand(String repository) {
        this.repository = repository;
    }

    public static class TerraformOutputDeserializer extends JsonDeserializer<String> {
        @Override
        public String deserialize(JsonParser parser, DeserializationContext context) throws IOException {
            JsonNode node = parser.readValueAsTree();
            if (node == null || node.isNull()) {
                return "";
            }
            if (node.isTextual()) {
                return node.asText();
            }
            return node.toString();
        }
    }
}
