package com.snow.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Profile query request and response. Used to retrieve or create user profiles based on email.")
public class ProfileQuery {

    @Schema(description = "Email address of the profile owner", requiredMode = Schema.RequiredMode.REQUIRED, example = "user@example.com")
    private String email;

    @Schema(description = "Actor/username associated with the profile", example = "yabinboxes")
    private String actor;

    @Schema(description = "User identifier", example = "54486644")
    private String actorId;

    @Schema(description = "Git repository type", example = "github")
    private String gitType;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Schema(description = "Snow authentication token (write-only; not returned in responses)", example = "snow-token-12345")
    private String snowToken;

    @Schema(description = "License information", example = "enterprise")
    private String license;

    @Schema(description = "Organization name", example = "MyOrg")
    private String org;
}
