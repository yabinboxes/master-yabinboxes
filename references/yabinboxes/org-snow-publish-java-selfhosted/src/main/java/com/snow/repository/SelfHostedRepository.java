package com.snow.repository;

import com.snow.model.SelfHosted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SelfHostedRepository extends JpaRepository<SelfHosted, Long> {

    Optional<SelfHosted> findFirstByOrderByIdAsc();
}
