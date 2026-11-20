package com.snow.controller;

import com.snow.model.DataSourceSnowDeploymentsPersistent;
import com.snow.service.SnowDeploymentQueryHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/connectors/get-snow-deployments-persistent", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Snow Deployment Queries", description = "Endpoints for querying Snow deployment information")
public class SnowPersistentDeploymentQueryController {

    private static final Logger queryControllerLog = LoggerFactory.getLogger("deployment-query-controller");

    private final SnowDeploymentQueryHandler snowDeploymentQueryHandler;

    public SnowPersistentDeploymentQueryController(SnowDeploymentQueryHandler snowDeploymentQueryHandler) {
        this.snowDeploymentQueryHandler = snowDeploymentQueryHandler;
    }

    @GetMapping
    @Operation(
            summary = "Get All Persistent Snow Deployments",
            description = "Retrieves all records from connectors.data_source_snow_deployments_persistent."
    )
    @ApiResponse(responseCode = "200", description = "List of persistent Snow deployment records")
    public ResponseEntity<List<DataSourceSnowDeploymentsPersistent>> getAllPersistentSnowDeployments() {
        queryControllerLog.info("Received request for all persistent deployment records");
        List<DataSourceSnowDeploymentsPersistent> deployments = snowDeploymentQueryHandler.getAllPersistentSnowDeployments();
        queryControllerLog.info("Returning {} persistent deployment records", deployments.size());
        return ResponseEntity.ok(deployments);
    }
}
