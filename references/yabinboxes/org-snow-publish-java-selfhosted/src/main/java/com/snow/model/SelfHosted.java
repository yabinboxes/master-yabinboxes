package com.snow.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "self_hosted", schema = "connectors")
public class SelfHosted {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_time_flag", nullable = false)
    private Integer firstTimeFlag = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "auth", nullable = false)
    private String auth = "gitlab";

    @Column(name = "base_url", nullable = false)
    private String baseUrl = "https://gitlab.com";

    @Column(name = "client_id", nullable = false)
    private String clientId = "";

    @Column(name = "redirect_uri", nullable = false)
    private String redirectUri = "http://localhost:4200/login";

    @Column(name = "host_base_url", nullable = false)
    private String hostBaseUrl = "";

    @PrePersist
    void rejectInsert() {
        throw new IllegalStateException("connectors.self_hosted allows a single record");
    }
}
