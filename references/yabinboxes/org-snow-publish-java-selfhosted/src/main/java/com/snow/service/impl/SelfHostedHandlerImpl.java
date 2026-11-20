package com.snow.service.impl;

import com.snow.entity.SelfHostedCommand;
import com.snow.model.SelfHosted;
import com.snow.repository.SelfHostedRepository;
import com.snow.service.SelfHostedHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SelfHostedHandlerImpl implements SelfHostedHandler {

    private final SelfHostedRepository selfHostedRepository;

    public SelfHostedHandlerImpl(SelfHostedRepository selfHostedRepository) {
        this.selfHostedRepository = selfHostedRepository;
    }

    @Override
    public Optional<SelfHosted> getSingleRecord() {
        return selfHostedRepository.findFirstByOrderByIdAsc();
    }

    @Override
    @Transactional
    public Optional<SelfHosted> finishFirstTime(SelfHostedCommand command) {
        return selfHostedRepository.findFirstByOrderByIdAsc()
                .map(record -> {
                    record.setAuth(command.getAuth().trim());
                    record.setBaseUrl(command.getBaseUrl().trim());
                    record.setClientId(command.getClientId() == null ? "" : command.getClientId().trim());
                    record.setRedirectUri(command.getRedirectUri() == null ? "" : command.getRedirectUri().trim());
                    record.setHostBaseUrl(command.getHostBaseUrl().trim());
                    record.setFirstTimeFlag(0);
                    return saveExisting(record);
                });
    }

    @Override
    @Transactional
    public Optional<SelfHosted> updateRecord(SelfHostedCommand command) {
        return selfHostedRepository.findFirstByOrderByIdAsc()
                .map(record -> {
                    apply(record, command);
                    return saveExisting(record);
                });
    }

    private SelfHosted saveExisting(SelfHosted record) {
        if (record.getId() == null || selfHostedRepository.count() != 1) {
            throw new IllegalStateException("connectors.self_hosted allows a single record");
        }
        return selfHostedRepository.save(record);
    }

    private void apply(SelfHosted record, SelfHostedCommand command) {
        if (command.getFirstTimeFlag() != null) {
            record.setFirstTimeFlag(command.getFirstTimeFlag());
        }
        if (command.getAuth() != null) {
            record.setAuth(command.getAuth().trim());
        }
        if (command.getBaseUrl() != null) {
            record.setBaseUrl(command.getBaseUrl().trim());
        }
        if (command.getClientId() != null) {
            record.setClientId(command.getClientId().trim());
        }
        if (command.getRedirectUri() != null) {
            record.setRedirectUri(command.getRedirectUri().trim());
        }
        if (command.getHostBaseUrl() != null) {
            record.setHostBaseUrl(command.getHostBaseUrl().trim());
        }
    }
}
