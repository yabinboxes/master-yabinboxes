package com.snow.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SelfHostedCommand {

    private Integer firstTimeFlag;
    private String auth;
    private String baseUrl;
    private String clientId;
    private String redirectUri;
    private String hostBaseUrl;

    public boolean hasChanges() {
        return firstTimeFlag != null
                || auth != null
                || baseUrl != null
                || clientId != null
                || redirectUri != null
                || hostBaseUrl != null;
    }
}
