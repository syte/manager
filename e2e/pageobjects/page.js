const { constants } = require('../constants');

export default class Page {
    get dialogTitle() { return $('[data-qa-dialog-title]'); }
    get dialogContent() { return $('[data-qa-dialog-content]'); }
    get dialogConfirm() { return $('[data-qa-confirm-cancel]'); }
    get dialogCancel() { return $('[data-qa-cancel-cancel]'); }
    get sidebarTitle() { return $('[data-qa-sidebar-title]'); }
    get drawerTitle() { return $('[data-qa-drawer-title]'); }
    get drawerClose() { return $('[data-qa-close-drawer]'); }
    get docs() { return $$('[data-qa-doc]'); }
    get toast() { return $('[data-qa-toast]'); }
    get toastMsg() { return $('[data-qa-toast-message]'); }
    get userMenu() { return $('[data-qa-user-menu]'); }
    get logoutButton() { return $('[data-qa-menu-link="Log Out"]'); }
    get profileButton() { return $('[data-qa-menu-link="My Profile"]'); }
    get globalCreate() { return $('[data-qa-add-new-menu-button]'); }
    get addVolumeMenu() { return $('[data-qa-add-new-menu="Volume"]'); }
    get addLinodeMenu() { return $('[data-qa-add-new-menu="Linode"]'); }
    get addNodeBalancerMenu() { return $('[data-qa-add-new-menu="NodeBalancer"]'); }
    get notice() { return $('[data-qa-notice]'); }
    get notices() { return $$('[data-qa-notice]'); }
    get progressBar() { return $('[data-qa-circle-progress]'); }
    get actionMenu() { return $('[data-qa-action-menu]'); }
    get actionMenuItem() { return $('[data-qa-action-menu-item]'); }

    constructor() {
        this.pageTitle = 'Base page';
    }

    open(path) {

    }

    logout() {
        this.userMenu.waitForVisible();
        this.userMenu.click();
        this.logoutButton.waitForVisible();
        this.logoutButton.click();
        this.logoutButton.waitForVisible(constants.wait.short, true);
        this.globalCreate.waitForVisible(constants.wait.short, true);

        browser.waitUntil(function() {
            return browser.getUrl().includes('/login');
        }, constants.wait.normal, 'Failed to redirect to login page on log out');
    }

    chooseSelectOption(selectElement, selectOption) {
        selectElement.click();
        browser.waitForVisible('[data-value]');

        if (Number.isInteger(selectOption)) {
            const optionElement = $$('[data-value]')[selectOption];
            optionElement.click();
            optionElement.waitForVisible(constants.wait.normal, true);
            return;
        }

        $(`[data-value="${selectOption}"]`).click();
        browser.waitForVisible(`[data-value="${selectOption}"]`, constants.wait.normal, true);
    }

    selectGlobalCreateItem(menuItem) {
        this.globalCreate.waitForVisible();
        this.globalCreate.click();
        browser.waitForVisible('[data-qa-add-new-menu]', constants.wait.normal);
        browser.click(`[data-qa-add-new-menu="${menuItem}"]`);
        browser.waitForVisible('[data-qa-add-new-menu]', constants.wait.normal, true);
    }

    waitForNotice(noticeMsg, timeout=10000, opposite=false) {
        return browser.waitUntil(function() {
            const noticeRegex = new RegExp(noticeMsg, 'ig');
            const noticeMsgDisplays = $$('[data-qa-notice]')
                .filter(n => !!n.getText().match(noticeRegex));

            if (opposite) {
                return noticeMsgDisplays.length === 0;
            }

            return noticeMsgDisplays.length > 0;
        }, timeout, `${noticeMsg} failed to display`);
    }

    assertDocsDisplay() {
        const sidebarTitle = this.sidebarTitle.getText();
        const docs = this.docs;
        expect(docs.length).toBe(2);
        expect(sidebarTitle).toBe('Linode Docs');
    }

    toastDisplays(expectedMessage) {
        this.toast.waitForVisible();
        this.toastMsg.waitForVisible();
        
        const displayedMsg = browser.getText('[data-qa-toast-message]');
        expect(displayedMsg).toBe(expectedMessage);
        browser.click('[data-qa-toast] button');
        browser.waitForExist('[data-qa-toast]', constants.wait.short, true);
    }

    dismissToast() {
        return browser.waitUntil(function() {
            if (browser.isVisible('[data-qa-toast]')) {
                browser.click('[data-qa-toast] button');
                const dismissed = browser.isVisible('[data-qa-toast]') ? true : false;
                return dismissed;
            }
            return true;
        }, constants.wait.normal);
    }


    selectActionMenuItem(tableCell, item) {
        tableCell.$(this.actionMenu.selector).click();
        browser.jsClick(`[data-qa-action-menu-item="${item}"]`);
    }

    closeDrawer() {
        this.drawerClose.click();
        this.drawerTitle.waitForVisible(constants.wait.normal, true);
    }

    changeTab(tab) {
        browser.jsClick(`[data-qa-tab="${tab}"]`);
        browser.waitUntil(function() {
            return browser
                .getAttribute(`[data-qa-tab="${tab}"]`, 'aria-selected').includes('true');
        }, constants.wait.short, 'Failed to change tab');
        browser.waitForVisible('[data-qa-circle-progress]', constants.wait.normal, true);
        return this;
    }
}
