/* globals XPCOMUtils, ExtensionAPI */

"use strict";

ChromeUtils.defineModuleGetter(
  this,
  "ExtensionParent",
  "resource://gre/modules/ExtensionParent.jsm"
);

XPCOMUtils.defineLazyGetter(this, "browserActionFor", () => {
  return ExtensionParent.apiManager.global.browserActionFor;
});

function runCommand(commandName) {
  const windowTracker = ChromeUtils.import(
    "resource://gre/modules/Extension.jsm",
    {}
  ).Management.global.windowTracker;
  const window = windowTracker.topWindow;
  const command = window.document.getElementById(commandName);
  return command.click();
}

function getTopWindow() {
  const windowTracker = ChromeUtils.import(
    "resource://gre/modules/Extension.jsm",
    {}
  ).Management.global.windowTracker;
  const window = windowTracker.topWindow;
  return window;
}

this.voice = class extends ExtensionAPI {
  getAPI(context) {
    const { extension } = context;

    return {
      experiments: {
        voice: {
          async openPopup() {
            const browserAction = browserActionFor(extension);
            browserAction.triggerAction(getTopWindow());
          },

          async undoCloseTab() {
            return runCommand("History:UndoCloseTab");
          },

          async undoCloseWindow() {
            return runCommand("History:UndoCloseWindow");
          },

          async openDownloads() {
            return runCommand("Tools:Downloads");
          },

          async clearBrowserHistory() {
            return runCommand("Tools:Sanitize");
          },

          async quitApplication() {
            return runCommand("cmd_quitApplication");
          },

          async openBookmarksSidebar() {
            await getTopWindow().SidebarUI.show("viewBookmarksSidebar");
          },

          async openHistorySidebar() {
            await getTopWindow().SidebarUI.show("viewHistorySidebar");
          },

          async closeSidebar() {
            await getTopWindow().SidebarUI.hide();
          },

          async toggleSidebar() {
            const lastOpenId = getTopWindow().SidebarUI.lastOpenedId;
            await getTopWindow().SidebarUI.toggle(
              lastOpenId || "viewHistorySidebar"
            );
          },

          async viewPageSource() {
            return runCommand("View:PageSource");
          },

          async zoomWindow() {
            return runCommand("zoomWindow");
          },

          async minimizeWindow() {
            return runCommand("minimizeWindow");
          },

          async showAllBookmarks() {
            return runCommand("Browser:ShowAllBookmarks");
          },

          async showAllHistory() {
            return runCommand("Browser:ShowAllHistory");
          },

          async openPreferences() {
            return runCommand("menu_preferences");
          },

          async browserOpenAddonsMgr() {
            return runCommand("Tools:Addons");
          },
        },
      },
    };
  }
};
