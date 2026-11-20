package com.snow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Entity
@Table(name = "profile_owners", schema = "connectors")
public class ProfileOwners {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "email")
    private String email;

    @Column(name = "actor")
    private String actor;

    @Column(name = "actor_id")
    private String actorId;

    @Column(name = "git_type")
    private String gitType;

    @Column(name = "snow_token")
    private String snowToken;

    @Column(name = "snow_token_pipeline")
    private String snowTokenPipeline;

    @Column(name = "license")
    private String license;

    @Column(name = "org")
    private String org;

    @Column(name = "role_profile", nullable = false, columnDefinition = "text not null default 'OWNER'")
    private String roleProfile = "OWNER";
}
