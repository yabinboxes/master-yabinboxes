package com.snow.service;

import com.snow.model.TabsAnonymous;

public interface TabsAnonymousHandler {
    TabsAnonymous createNewTab(String name);
    boolean deleteTab(Long tabId);
    TabsAnonymous updateTab(Long tabId, String tabName);
}
