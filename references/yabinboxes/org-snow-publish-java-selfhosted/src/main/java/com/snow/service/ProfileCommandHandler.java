package com.snow.service;

import com.snow.entity.ProfileQuery;

public interface ProfileCommandHandler {
    ProfileQuery getProfile(ProfileQuery eProfileQuery);
    ProfileQuery modifyProfile(ProfileQuery eProfileQuery);
    String getSnowTokenPipeline(String actorId, String gitType);
    String regenerateSnowTokenPipeline(String actorId, String gitType);
}
