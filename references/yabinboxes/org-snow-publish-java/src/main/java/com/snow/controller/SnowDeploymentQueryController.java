package com.snow.controller;

import com.snow.model.SnowDeploymentsAnonymous;
import com.snow.service.SnowDeploymentQueryHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/connectors/get-snow-deployments", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Snow Deployment Queries", description = "Endpoints for querying Snow deployment information")
public class SnowDeploymentQueryController {

    private static final Logger queryControllerLog = LoggerFactory.getLogger("deployment-query-controller");

    private final SnowDeploymentQueryHandler snowDeploymentQueryHandler;

    public SnowDeploymentQueryController(SnowDeploymentQueryHandler snowDeploymentQueryHandler) {
        this.snowDeploymentQueryHandler = snowDeploymentQueryHandler;
    }

    @GetMapping
    @Operation(
            summary = "Get Snow Deployments",
            description = "Retrieves Snow deployment records from snow_deployments_{profile_id}. Resolves profile by actorId and optional gitType. Optionally filter by type."
    )
    @ApiResponse(responseCode = "200", description = "List of Snow deployment records")
    public ResponseEntity<List<SnowDeploymentsAnonymous>> getSnowDeploymentsByActorId(
            @Parameter(description = "Filter by actor/user identifier. Optional.")
            @RequestParam(required = false) String actorId,
            @Parameter(description = "Filter by deployment type. Valid values: CLUSTER, SERVICE, APPLICATION, WORKFLOW_CALL, REPOSITORY, RESOURCE. Pass ALL to return all types.")
            @RequestParam(required = false) String type,
            @Parameter(description = "Optional gitType filter for profile lookup")
            @RequestParam(required = false) String gitType) {
        queryControllerLog.info("Received query request - actorId: {}, type: {}, gitType: {}", actorId, type, gitType);
        List<SnowDeploymentsAnonymous> deployments = snowDeploymentQueryHandler.getSnowDeploymentsByActorId(actorId, type, gitType);
        queryControllerLog.info("Returning {} deployment records", deployments.size());
        return ResponseEntity.ok(deployments);
    }

    @GetMapping("/all")
    @Operation(
            summary = "Get All Snow Deployments",
            description = "Retrieves all anonymous Snow deployment records from the public read model without any filtering."
    )
    @ApiResponse(responseCode = "200", description = "List of all anonymous Snow deployment records")
    public ResponseEntity<List<SnowDeploymentsAnonymous>> getAllSnowDeployments() {
        queryControllerLog.info("Received request for all deployment records");
        List<SnowDeploymentsAnonymous> deployments = snowDeploymentQueryHandler.getAllSnowDeployments();
        queryControllerLog.info("Returning {} deployment records", deployments.size());
        return ResponseEntity.ok(deployments);
    }
}
