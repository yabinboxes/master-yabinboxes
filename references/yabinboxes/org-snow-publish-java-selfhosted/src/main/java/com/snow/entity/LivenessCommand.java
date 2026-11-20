package com.snow.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivenessCommand {

    @NotBlank(message = "repository is required")
    private String repository;

    @NotBlank(message = "status is required")
    private String status;

    private String response;
}
