package com.snow.service;

import com.snow.entity.SelfHostedCommand;
import com.snow.model.SelfHosted;

import java.util.Optional;

public interface SelfHostedHandler {

    Optional<SelfHosted> getSingleRecord();

    Optional<SelfHosted> finishFirstTime(SelfHostedCommand command);

    Optional<SelfHosted> updateRecord(SelfHostedCommand command);
}
