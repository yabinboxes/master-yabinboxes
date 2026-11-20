package com.snow.service.impl;

import com.snow.model.TabsAnonymous;
import com.snow.repository.TabsAnonymousRepository;
import com.snow.service.TabsAnonymousHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TabsAnonymousHandlerImpl implements TabsAnonymousHandler {

    private final TabsAnonymousRepository tabsAnonymousRepository;

    public TabsAnonymousHandlerImpl(TabsAnonymousRepository tabsAnonymousRepository) {
        this.tabsAnonymousRepository = tabsAnonymousRepository;
    }

    @Override
    @Transactional
    public TabsAnonymous createNewTab(String name) {
        if (name == null || name.isEmpty()) {
            return null;
        }

        TabsAnonymous tab = new TabsAnonymous();
        tab.setTabName(name);
        TabsAnonymous saved = tabsAnonymousRepository.save(tab);
        System.out.println("Database insert connectors.tabs_anonymous: tabId="
                + saved.getTabId()
                + ", tabName=" + saved.getTabName());
        return saved;
    }

    @Override
    @Transactional
    public boolean deleteTab(Long tabId) {
        if (tabId == null) {
            return false;
        }

        if (!tabsAnonymousRepository.existsById(tabId)) {
            return false;
        }

        tabsAnonymousRepository.deleteById(tabId);
        return true;
    }

    @Override
    @Transactional
    public TabsAnonymous updateTab(Long tabId, String tabName) {
        if (tabId == null || tabName == null || tabName.isEmpty()) {
            return null;
        }

        return tabsAnonymousRepository.findById(tabId)
                .map(tab -> {
                    tab.setTabName(tabName);
                    return tabsAnonymousRepository.save(tab);
                })
                .orElse(null);
    }
}
