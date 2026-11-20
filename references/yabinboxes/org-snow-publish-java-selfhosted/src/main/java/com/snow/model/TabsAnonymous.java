package com.snow.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tabs_anonymous", schema = "connectors")
public class TabsAnonymous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tab_id")
    private Long tabId;

    @Column(name = "tab_name")
    private String tabName;
}
