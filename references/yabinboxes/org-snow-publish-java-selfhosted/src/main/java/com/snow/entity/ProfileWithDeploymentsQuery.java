package com.snow.entity;

import com.snow.model.ProfileOwners;
import com.snow.model.SnowDeploymentsAnonymous;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Profile owner record with all deployments from snow_deployments_{profileId}.")
public class ProfileWithDeploymentsQuery {

    @Schema(description = "Profile owner record from connectors.profile_owners")
    private ProfileOwners profile;

    @Schema(description = "Deployment records from connectors.snow_deployments_{profileId}")
    private List<SnowDeploymentsAnonymous> deployments;
}
