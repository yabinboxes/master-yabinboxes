package com.snow.repository;

import com.snow.model.SnowDeploymentsAnonymous;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Repository
public class ProfileSnowDeploymentsRepository {

    private static final Logger profileDeploymentsRepoLog = LoggerFactory.getLogger("profile-deployments-repository");

    private static final Pattern ALLOWED_TABLE_NAME =
            Pattern.compile("^snow_deployments_(anonymous|\\d+)$");

    private static final String PROFILE_DEPLOYMENT_COLUMNS = """
            snow_deployment_id, snow_type, snow_name, git_type, provider, actor, actor_id, email,
            repository_owner, repository, environment, created_at, updated_at, status,
            url, url_path, port, image, registry, description, extras, payload,
            health_check_url, health_check_time, notes, color, liveness_type,
            liveness_status, liveness_response, tab_name, tab_id, terraform_output,
            terraform_vars, docker_output, docker_vars
            """;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void createTableIfNotExists(Long profileId) {
        if (profileId == null) {
            profileDeploymentsRepoLog.warn("Cannot create profile deployments table: profileId is null");
            return;
        }

        String tableName = "snow_deployments_" + profileId;
        String tableRef = "connectors." + tableName;
        String pkConstraint = tableName + "_pkey";
        String uniqueConstraint = "uq_" + tableName + "_repository";
        String createdAtIndex = "idx_" + tableName + "_created_at";

        profileDeploymentsRepoLog.info("Creating table if not exists: {}", tableRef);
        addDeploymentTextColumns("connectors.snow_deployments_anonymous");

        entityManager.createNativeQuery(
                        "CREATE TABLE IF NOT EXISTS " + tableRef
                                + " (LIKE connectors.snow_deployments_anonymous INCLUDING DEFAULTS INCLUDING IDENTITY)")
                .executeUpdate();

        entityManager.createNativeQuery("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint WHERE conname = '%s'
                    ) THEN
                        ALTER TABLE %s ADD CONSTRAINT %s PRIMARY KEY (snow_deployment_id);
                    END IF;
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint WHERE conname = '%s'
                    ) THEN
                        ALTER TABLE %s ADD CONSTRAINT %s UNIQUE (repository);
                    END IF;
                END $$
                """.formatted(pkConstraint, tableRef, pkConstraint, uniqueConstraint, tableRef, uniqueConstraint))
                .executeUpdate();

        entityManager.createNativeQuery(
                        "CREATE INDEX IF NOT EXISTS " + createdAtIndex + " ON " + tableRef + " (created_at DESC)")
                .executeUpdate();
        addDeploymentTextColumns(tableRef);

        profileDeploymentsRepoLog.info("Successfully ensured table exists: {}", tableRef);
    }

    @Transactional
    public void upsertProfileDeployments(Long profileId, List<SnowDeploymentsAnonymous> records) {
        if (profileId == null || records == null || records.isEmpty()) {
            return;
        }

        createTableIfNotExists(profileId);
        String tableRef = "connectors.snow_deployments_" + profileId;

        profileDeploymentsRepoLog.info("Upserting {} deployment records into {}", records.size(), tableRef);

        for (SnowDeploymentsAnonymous record : records) {
            entityManager.createNativeQuery("""
                    INSERT INTO %s (
                        snow_type, snow_name, git_type, provider, actor, actor_id, email, repository_owner, repository,
                        environment, created_at, updated_at, status, url, url_path, port, image, registry,
                        description, extras, payload, health_check_url, health_check_time, notes, color,
                        liveness_type, liveness_status, liveness_response, tab_name, tab_id, terraform_output,
                        terraform_vars, docker_output, docker_vars
                    ) VALUES (
                        :snowType, :snowName, :gitType, :provider, :actor, :actorId, :email, :repositoryOwner, :repository,
                        :environment, :createdAt, :updatedAt, :status, :url, :urlPath, :port, :image, :registry,
                        :description, :extras, :payload, :healthCheckUrl, :healthCheckTime, :notes, :color,
                        :livenessType, :livenessStatus, :livenessResponse, :tabName, :tabId, :terraformOutput,
                        :terraformVars, :dockerOutput, :dockerVars
                    )
                    ON CONFLICT (repository) DO UPDATE SET
                        snow_type = EXCLUDED.snow_type,
                        snow_name = EXCLUDED.snow_name,
                        git_type = EXCLUDED.git_type,
                        provider = EXCLUDED.provider,
                        actor = EXCLUDED.actor,
                        actor_id = EXCLUDED.actor_id,
                        email = EXCLUDED.email,
                        repository_owner = EXCLUDED.repository_owner,
                        status = EXCLUDED.status,
                        url = EXCLUDED.url,
                        environment = EXCLUDED.environment,
                        url_path = EXCLUDED.url_path,
                        tab_name = EXCLUDED.tab_name,
                        tab_id = EXCLUDED.tab_id,
                        port = EXCLUDED.port,
                        image = EXCLUDED.image,
                        registry = EXCLUDED.registry,
                        description = EXCLUDED.description,
                        extras = EXCLUDED.extras,
                        payload = EXCLUDED.payload,
                        health_check_url = EXCLUDED.health_check_url,
                        health_check_time = EXCLUDED.health_check_time,
                        notes = EXCLUDED.notes,
                        terraform_output = EXCLUDED.terraform_output,
                        terraform_vars = EXCLUDED.terraform_vars,
                        docker_output = EXCLUDED.docker_output,
                        docker_vars = EXCLUDED.docker_vars,
                        updated_at = now()
                    """.formatted(tableRef))
                    .setParameter("snowType", record.getSnowType())
                    .setParameter("snowName", record.getSnowName())
                    .setParameter("gitType", record.getGitType())
                    .setParameter("provider", record.getProvider())
                    .setParameter("actor", record.getActor())
                    .setParameter("actorId", record.getActorId())
                    .setParameter("email", record.getEmail())
                    .setParameter("repositoryOwner", record.getRepositoryOwner())
                    .setParameter("repository", record.getRepository())
                    .setParameter("environment", record.getEnvironment())
                    .setParameter("createdAt", record.getCreatedAt())
                    .setParameter("updatedAt", record.getUpdatedAt())
                    .setParameter("status", record.getStatus())
                    .setParameter("url", record.getUrl())
                    .setParameter("urlPath", record.getUrlPath())
                    .setParameter("port", record.getPort())
                    .setParameter("image", record.getImage())
                    .setParameter("registry", record.getRegistry())
                    .setParameter("description", record.getDescription())
                    .setParameter("extras", record.getExtras())
                    .setParameter("payload", record.getPayload())
                    .setParameter("healthCheckUrl", record.getHealthCheckUrl())
                    .setParameter("healthCheckTime", record.getHealthCheckTime())
                    .setParameter("notes", record.getNotes())
                    .setParameter("color", record.getColor())
                    .setParameter("livenessType", record.getLivenessType())
                    .setParameter("livenessStatus", record.getLivenessStatus())
                    .setParameter("livenessResponse", record.getLivenessResponse())
                    .setParameter("tabName", record.getTabName())
                    .setParameter("tabId", record.getTabId())
                    .setParameter("terraformOutput", record.getTerraformOutput())
                    .setParameter("terraformVars", record.getTerraformVars())
                    .setParameter("dockerOutput", record.getDockerOutput())
                    .setParameter("dockerVars", record.getDockerVars())
                    .executeUpdate();
            System.out.println("Database insert " + tableRef + ": snowName="
                    + record.getSnowName()
                    + ", snowType=" + record.getSnowType()
                    + ", repository=" + record.getRepository()
                    + ", actorId=" + record.getActorId());
        }

        profileDeploymentsRepoLog.info("Successfully upserted {} deployment records into {}", records.size(), tableRef);
    }

    @Transactional
    public List<SnowDeploymentsAnonymous> findAllByProfileId(Long profileId, String snowType) {
        if (profileId == null) {
            return Collections.emptyList();
        }

        createTableIfNotExists(profileId);
        return queryAllByProfileId(profileId, snowType);
    }

    @Transactional(readOnly = true)
    public List<SnowDeploymentsAnonymous> findAllByProfileIdReadOnly(Long profileId) {
        if (profileId == null || !profileDeploymentsTableExists(profileId)) {
            return Collections.emptyList();
        }
        return queryAllByProfileId(profileId, null);
    }

    private List<SnowDeploymentsAnonymous> queryAllByProfileId(Long profileId, String snowType) {
        String tableRef = "connectors.snow_deployments_" + profileId;
        boolean allTypes = snowType == null || snowType.isBlank() || "ALL".equalsIgnoreCase(snowType);

        profileDeploymentsRepoLog.info("Reading all records from {} with type filter: {}", tableRef, allTypes ? "ALL" : snowType);

        String sql = allTypes
                ? "SELECT " + PROFILE_DEPLOYMENT_COLUMNS + " FROM " + tableRef + " ORDER BY created_at DESC"
                : "SELECT " + PROFILE_DEPLOYMENT_COLUMNS + " FROM " + tableRef
                + " WHERE snow_type = :snowType ORDER BY created_at DESC";

        var query = entityManager.createNativeQuery(sql);
        if (!allTypes) {
            query.setParameter("snowType", snowType);
        }

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<SnowDeploymentsAnonymous> results = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            results.add(mapProfileDeploymentRow(row));
        }

        profileDeploymentsRepoLog.info("Found {} deployment records in {}", results.size(), tableRef);
        return results;
    }

    @Transactional(readOnly = true)
    public boolean profileDeploymentsTableExists(Long profileId) {
        if (profileId == null) {
            return false;
        }
        String tableName = "snow_deployments_" + profileId;
        @SuppressWarnings("unchecked")
        List<Boolean> rows = entityManager.createNativeQuery("""
                        SELECT EXISTS (
                            SELECT 1 FROM information_schema.tables
                            WHERE table_schema = 'connectors' AND table_name = :tableName
                        )
                        """)
                .setParameter("tableName", tableName)
                .getResultList();
        return !rows.isEmpty() && Boolean.TRUE.equals(rows.get(0));
    }

    @Transactional
    public List<SnowDeploymentsAnonymous> findAllByTableRef(String tableRef) {
        String bareName = tableRef.substring("connectors.".length());
        if (bareName.matches("snow_deployments_\\d+")) {
            Long profileId = Long.parseLong(bareName.substring("snow_deployments_".length()));
            createTableIfNotExists(profileId);
        }

        profileDeploymentsRepoLog.info("Reading all records from {}", tableRef);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(
                        "SELECT " + PROFILE_DEPLOYMENT_COLUMNS + " FROM " + tableRef + " ORDER BY created_at DESC")
                .getResultList();

        List<SnowDeploymentsAnonymous> results = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            results.add(mapProfileDeploymentRow(row));
        }

        profileDeploymentsRepoLog.info("Found {} deployment records in {}", results.size(), tableRef);
        return results;
    }

    public static Optional<String> resolveTableRef(String tableName) {
        if (tableName == null || tableName.isBlank()) {
            return Optional.empty();
        }
        String normalized = tableName.trim();
        if (normalized.regionMatches(true, 0, "connectors.", 0, "connectors.".length())) {
            normalized = normalized.substring("connectors.".length());
        }
        if (!ALLOWED_TABLE_NAME.matcher(normalized).matches()) {
            return Optional.empty();
        }
        return Optional.of("connectors." + normalized);
    }

    @Transactional
    public boolean deleteByRepository(Long profileId, String repository) {
        if (profileId == null || repository == null || repository.isBlank()) {
            return false;
        }
        if (!profileDeploymentsTableExists(profileId)) {
            profileDeploymentsRepoLog.warn(
                    "Cannot delete deployment: table snow_deployments_{} does not exist", profileId);
            return false;
        }

        String tableRef = "connectors.snow_deployments_" + profileId;
        profileDeploymentsRepoLog.info("Deleting deployment by repository: {} from {}", repository, tableRef);

        int deleted = entityManager.createNativeQuery(
                        "DELETE FROM " + tableRef + " WHERE repository = :repository")
                .setParameter("repository", repository)
                .executeUpdate();

        if (deleted > 0) {
            profileDeploymentsRepoLog.info("Deleted {} deployment record(s) for repository: {} from {}",
                    deleted, repository, tableRef);
            return true;
        }

        profileDeploymentsRepoLog.info("No deployment found for repository: {} in {}", repository, tableRef);
        return false;
    }

    @Transactional(readOnly = true)
    public Optional<String> findUrlBySnowName(Long profileId, String snowName, String gitType) {
        if (profileId == null || snowName == null || snowName.isBlank()) {
            return Optional.empty();
        }

        String tableRef = "connectors.snow_deployments_" + profileId;
        boolean filterByGitType = gitType != null && !gitType.isBlank();
        profileDeploymentsRepoLog.info("Finding url by snowName: {} in {} with gitType filter: {}",
                snowName, tableRef, filterByGitType ? gitType : "none");

        String sql = filterByGitType
                ? "SELECT url FROM " + tableRef
                + " WHERE snow_name = :snowName AND git_type = :gitType ORDER BY created_at DESC LIMIT 1"
                : "SELECT url FROM " + tableRef
                + " WHERE snow_name = :snowName ORDER BY created_at DESC LIMIT 1";

        var query = entityManager.createNativeQuery(sql)
                .setParameter("snowName", snowName);
        if (filterByGitType) {
            query.setParameter("gitType", gitType);
        }

        @SuppressWarnings("unchecked")
        List<Object> rows = query.getResultList();

        if (rows.isEmpty() || rows.get(0) == null) {
            profileDeploymentsRepoLog.info("No url found for snowName: {} in {}", snowName, tableRef);
            return Optional.empty();
        }

        String url = rows.get(0).toString();
        profileDeploymentsRepoLog.info("Found url for snowName: {} in {}", snowName, tableRef);
        return Optional.of(url);
    }

    @Transactional(readOnly = true)
    public Optional<String> findRepositoryBySnowName(Long profileId, String snowName, String gitType) {
        if (profileId == null || snowName == null || snowName.isBlank()) {
            return Optional.empty();
        }

        String tableRef = "connectors.snow_deployments_" + profileId;
        boolean filterByGitType = gitType != null && !gitType.isBlank();
        profileDeploymentsRepoLog.info("Finding repository by snowName: {} in {} with gitType filter: {}",
                snowName, tableRef, filterByGitType ? gitType : "none");

        String sql = filterByGitType
                ? "SELECT repository FROM " + tableRef
                + " WHERE snow_name = :snowName AND git_type = :gitType ORDER BY created_at DESC LIMIT 1"
                : "SELECT repository FROM " + tableRef
                + " WHERE snow_name = :snowName ORDER BY created_at DESC LIMIT 1";

        var query = entityManager.createNativeQuery(sql)
                .setParameter("snowName", snowName);
        if (filterByGitType) {
            query.setParameter("gitType", gitType);
        }

        @SuppressWarnings("unchecked")
        List<Object> rows = query.getResultList();

        if (rows.isEmpty() || rows.get(0) == null) {
            profileDeploymentsRepoLog.info("No repository found for snowName: {} in {}", snowName, tableRef);
            return Optional.empty();
        }

        String repository = rows.get(0).toString();
        profileDeploymentsRepoLog.info("Found repository for snowName: {} in {}", snowName, tableRef);
        return Optional.of(repository);
    }

    private static SnowDeploymentsAnonymous mapProfileDeploymentRow(Object[] row) {
        SnowDeploymentsAnonymous deployment = new SnowDeploymentsAnonymous();
        deployment.setSnowDeploymentId(row[0] != null ? ((Number) row[0]).longValue() : null);
        deployment.setSnowType(asString(row[1]));
        deployment.setSnowName(asString(row[2]));
        deployment.setGitType(asString(row[3]));
        deployment.setProvider(asString(row[4]));
        deployment.setActor(asString(row[5]));
        deployment.setActorId(asString(row[6]));
        deployment.setEmail(asString(row[7]));
        deployment.setRepositoryOwner(asString(row[8]));
        deployment.setRepository(asString(row[9]));
        deployment.setEnvironment(asString(row[10]));
        deployment.setCreatedAt(toOffsetDateTime(row[11]));
        deployment.setUpdatedAt(toOffsetDateTime(row[12]));
        deployment.setStatus(asString(row[13]));
        deployment.setUrl(asString(row[14]));
        deployment.setUrlPath(asString(row[15]));
        deployment.setPort(asString(row[16]));
        deployment.setImage(asString(row[17]));
        deployment.setRegistry(asString(row[18]));
        deployment.setDescription(asString(row[19]));
        deployment.setExtras(asString(row[20]));
        deployment.setPayload(asString(row[21]));
        deployment.setHealthCheckUrl(asString(row[22]));
        deployment.setHealthCheckTime(asString(row[23]));
        deployment.setNotes(asString(row[24]));
        deployment.setColor(asString(row[25]));
        deployment.setLivenessType(asString(row[26]));
        deployment.setLivenessStatus(asString(row[27]));
        deployment.setLivenessResponse(asString(row[28]));
        deployment.setTabName(asString(row[29]));
        deployment.setTabId(row[30] != null ? ((Number) row[30]).intValue() : 0);
        deployment.setTerraformOutput(asString(row[31]));
        deployment.setTerraformVars(asString(row[32]));
        deployment.setDockerOutput(asString(row[33]));
        deployment.setDockerVars(asString(row[34]));
        return deployment;
    }

    private static final String[] DEPLOYMENT_TEXT_COLUMNS = {
            "terraform_output", "terraform_vars", "docker_output", "docker_vars"
    };

    @Transactional
    public void ensureTerraformOutputColumns() {
        addDeploymentTextColumns("connectors.snow_deployments_anonymous");
        addDeploymentTextColumns("connectors.data_source_snow_deployments_persistent");
        addDeploymentTextColumns("connectors.data_source_snow_deployments_volatile");
        entityManager.createNativeQuery("""
                DO $$
                DECLARE
                    profile_table text;
                    text_column text;
                BEGIN
                    FOREACH text_column IN ARRAY ARRAY['terraform_output', 'terraform_vars', 'docker_output', 'docker_vars']
                    LOOP
                        FOR profile_table IN
                            SELECT table_name
                            FROM information_schema.tables
                            WHERE table_schema = 'connectors'
                              AND table_name ~ '^snow_deployments_[0-9]+$'
                        LOOP
                            EXECUTE format(
                                'ALTER TABLE connectors.%I ADD COLUMN IF NOT EXISTS %I TEXT',
                                profile_table,
                                text_column
                            );
                        END LOOP;
                    END LOOP;
                END $$
                """).executeUpdate();
    }

    private void addDeploymentTextColumns(String tableRef) {
        for (String column : DEPLOYMENT_TEXT_COLUMNS) {
            entityManager.createNativeQuery(
                            "ALTER TABLE " + tableRef + " ADD COLUMN IF NOT EXISTS " + column + " TEXT")
                    .executeUpdate();
        }
    }

    private static String asString(Object value) {
        return value != null ? value.toString() : "";
    }

    private static OffsetDateTime toOffsetDateTime(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof OffsetDateTime offsetDateTime) {
            return offsetDateTime;
        }
        if (value instanceof Instant instant) {
            return instant.atOffset(ZoneOffset.UTC);
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toInstant().atOffset(ZoneOffset.UTC);
        }
        return null;
    }
}
