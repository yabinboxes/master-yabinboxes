package com.snow.config;

import com.snow.repository.ProfileSnowDeploymentsRepository;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Statement;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PostgresConnectionDiagnostics implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger("postgres-connection");

    private static final Pattern JDBC_URL_PATTERN =
            Pattern.compile("jdbc:postgresql://([^:/]+)(?::(\\d+))?/([^?]+)");

    private final DataSource dataSource;
    private final Environment environment;
    private final ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository;

    public PostgresConnectionDiagnostics(
            DataSource dataSource,
            Environment environment,
            ProfileSnowDeploymentsRepository profileSnowDeploymentsRepository) {
        this.dataSource = dataSource;
        this.environment = environment;
        this.profileSnowDeploymentsRepository = profileSnowDeploymentsRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        String jdbcUrl = environment.getProperty("spring.datasource.url", "<not set>");
        String username = environment.getProperty("spring.datasource.username", "<not set>");
        String password = environment.getProperty("spring.datasource.password");

        log.info("========== PostgreSQL connection info ==========");
        log.info("spring.datasource.url={}", jdbcUrl);
        log.info("spring.datasource.username={}", username);
        log.info("spring.datasource.password={}", password == null || password.isBlank() ? "<not set>" : "<set>");
        log.info("POSTGRES_DB_URL={}", envOrUnset("POSTGRES_DB_URL"));
        log.info("POSTGRES_USER={}", envOrUnset("POSTGRES_USER"));
        log.info("POSTGRES_PASSWORD={}", maskSecret(envOrUnset("POSTGRES_PASSWORD")));

        if (envOrUnset("POSTGRES_DB_URL").equals("<not set>")) {
            log.warn("POSTGRES_DB_URL is not set — using application.properties default (localhost:5434).");
            log.warn("Inside Docker, localhost is the java-app container itself, not the host or postgres service.");
        }

        logParsedTarget(jdbcUrl);

        if (dataSource instanceof HikariDataSource hikari) {
            log.info("hikari.jdbc-url={}", hikari.getJdbcUrl());
            log.info("hikari.username={}", hikari.getUsername());
            log.info("hikari.pool-name={}", hikari.getPoolName());
            log.info("hikari.maximum-pool-size={}", hikari.getMaximumPoolSize());
        }

        log.info("Testing connection...");
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData meta = connection.getMetaData();
            log.info("Connection OK");
            log.info("jdbc.catalog={}", connection.getCatalog());
            log.info("jdbc.schema={}", connection.getSchema());
            log.info("db.product={} {}", meta.getDatabaseProductName(), meta.getDatabaseProductVersion());
            log.info("db.driver={} {}", meta.getDriverName(), meta.getDriverVersion());
            log.info("db.url={}", meta.getURL());

            try (Statement statement = connection.createStatement();
                 var rs = statement.executeQuery("SELECT current_database(), inet_server_addr(), inet_server_port()")) {
                if (rs.next()) {
                    log.info("pg.current_database={}", rs.getString(1));
                    log.info("pg.inet_server_addr={}", rs.getString(2));
                    log.info("pg.inet_server_port={}", rs.getObject(3));
                }
            }

            try {
                profileSnowDeploymentsRepository.ensureTerraformOutputColumns();
                log.info("Ensured terraform_output, terraform_vars, docker_output, and docker_vars columns on deployment tables");
            } catch (Exception ex) {
                log.error("Failed to ensure deployment text columns: {}", ex.getMessage(), ex);
            }
        } catch (Exception ex) {
            log.error("Connection FAILED: {}", ex.getMessage(), ex);
            logCauseChain(ex);
        }
        log.info("================================================");
    }

    private String envOrUnset(String name) {
        String value = environment.getProperty(name);
        return value != null && !value.isBlank() ? value : "<not set>";
    }

    private static String maskSecret(String value) {
        return "<not set>".equals(value) ? value : "<set>";
    }

    private static void logParsedTarget(String jdbcUrl) {
        Matcher matcher = JDBC_URL_PATTERN.matcher(jdbcUrl);
        if (matcher.matches()) {
            String host = matcher.group(1);
            String port = matcher.group(2) != null ? matcher.group(2) : "5432";
            String database = matcher.group(3);
            log.info("target.host={}", host);
            log.info("target.port={}", port);
            log.info("target.database={}", database);
        } else {
            log.warn("target.parse=failed for url {}", jdbcUrl);
        }
    }

    private static void logCauseChain(Throwable throwable) {
        int depth = 0;
        Throwable current = throwable;
        while (current != null && depth < 10) {
            log.error("cause[{}]: {} — {}", depth, current.getClass().getName(), current.getMessage());
            current = current.getCause();
            depth++;
        }
    }
}
