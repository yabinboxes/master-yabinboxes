package com.snow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI snowPublishOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Snow Publish Java API")
                        .version("1.0.0-SNAPSHOT")
                        .description("API for managing and querying Snow deployments. This service provides endpoints to publish deployment commands and retrieve anonymous deployment information.")
                        .contact(new Contact()
                                .name("Snow Publish Support")
                                .email("support@example.com")))
                .servers(List.of(new Server().url("http://localhost:8080")));
    }
}
