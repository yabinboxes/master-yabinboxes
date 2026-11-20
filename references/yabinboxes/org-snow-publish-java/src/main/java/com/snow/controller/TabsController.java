package com.snow.controller;

import com.snow.model.TabsAnonymous;
import com.snow.repository.TabsAnonymousRepository;
import com.snow.service.TabsAnonymousHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/connectors/tabs")
@Tag(name = "Tabs", description = "Endpoints for managing tabs")
public class TabsController {

    private static final Logger tabsControllerLog = LoggerFactory.getLogger("tabs-controller");

    private final TabsAnonymousHandler tabsAnonymousHandler;
    private final TabsAnonymousRepository tabsAnonymousRepository;

    public TabsController(TabsAnonymousHandler tabsAnonymousHandler, TabsAnonymousRepository tabsAnonymousRepository) {
        this.tabsAnonymousHandler = tabsAnonymousHandler;
        this.tabsAnonymousRepository = tabsAnonymousRepository;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create tab", description = "Creates a new tab with the provided tab name.")
    public ResponseEntity<?> createTab(@RequestBody TabsAnonymous tabRequest) {
        tabsControllerLog.info("Received create tab request");

        if (tabRequest == null || tabRequest.getTabName() == null || tabRequest.getTabName().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"tabName is required\"}");
        }

        try {
            TabsAnonymous tab = tabsAnonymousHandler.createNewTab(tabRequest.getTabName());
            if (tab == null) {
                return ResponseEntity.badRequest().body("{\"error\": \"tabName is required\"}");
            }
            tabsControllerLog.info("Tab created successfully: {}", tab.getTabName());
            return ResponseEntity.status(201).body(tab);
        } catch (Exception e) {
            tabsControllerLog.error("Failed to create tab: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to create tab\"}");
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "List tabs", description = "Returns all tab records.")
    public ResponseEntity<?> listTabs() {
        tabsControllerLog.info("Received list tabs request");
        return ResponseEntity.ok(tabsAnonymousRepository.findAll());
    }

    @DeleteMapping(value = "/{tabId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Delete tab", description = "Deletes a tab by tabId.")
    public ResponseEntity<String> deleteTab(@PathVariable("tabId") Long tabId) {
        boolean deleted = tabsAnonymousHandler.deleteTab(tabId);
        if (!deleted) {
            return ResponseEntity.status(404).body("{\"error\": \"Tab not found for id: " + tabId + "\"}");
        }
        return ResponseEntity.ok("{\"message\": \"Tab deleted successfully\", \"tabId\": " + tabId + "}");
    }

    @PutMapping(value = "/{tabId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Update tab", description = "Updates a tab name by tabId.")
    public ResponseEntity<?> updateTab(@PathVariable("tabId") Long tabId, @RequestBody TabsAnonymous tabRequest) {
        if (tabRequest == null || tabRequest.getTabName() == null || tabRequest.getTabName().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"tabName is required\"}");
        }

        TabsAnonymous updated = tabsAnonymousHandler.updateTab(tabId, tabRequest.getTabName());
        if (updated == null) {
            return ResponseEntity.status(404).body("{\"error\": \"Tab not found for id: " + tabId + "\"}");
        }
        return ResponseEntity.ok(updated);
    }
}
