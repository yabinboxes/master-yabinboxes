package com.snow.repository;

import com.snow.model.TabsAnonymous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TabsAnonymousRepository extends JpaRepository<TabsAnonymous, Long> {
}
