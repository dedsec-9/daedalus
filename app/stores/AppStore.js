// @flow
import { observable, computed } from 'mobx';
import Store from './lib/Store';
import Request from './lib/LocalizedRequest';
import globalMessages from '../i18n/global-messages';
import LocalizableError from '../i18n/LocalizableError';
import { ROUTES } from '../Routes';
import { buildRoute } from '../lib/routing-helpers';

export default class AppStore extends Store {

  LANGUAGE_OPTIONS = [
    { value: 'en-US', label: globalMessages.languageEnglish },
    { value: 'ja-JP', label: globalMessages.languageJapanese },
    // { value: 'zh-CN', label: globalMessages.languageChinese },
    // { value: 'ko-KR', label: globalMessages.languageKorean },
    // { value: 'de-DE', label: globalMessages.languageGerman },
    // { value: 'hr-HR', label: globalMessages.languageCroatian },
  ];

  /* eslint-disable max-len */
  @observable getProfileLocaleRequest: Request<string> = new Request(this.api.getUserLocale);
  @observable setProfileLocaleRequest: Request<string> = new Request(this.api.setUserLocale);
  @observable error: ?LocalizableError = null;
  /* eslint-enable max-len */

  setup() {
    this.actions.router.goToRoute.listen(this._updateRouteLocation);
    this.actions.profile.updateLocale.listen(this._updateLocale);
    this.registerReactions([
      this._redirectToMainUiAfterLocaleIsSet,
      this._redirectToLanguageSelectionIfNoLocaleSet,
      this._redirectToLoadingScreenWhenDisconnected
    ]);
  }

  @computed get currentRoute(): string {
    return this.stores.router.location.pathname;
  }

  @computed get currentLocale(): string {
    const { result } = this.getProfileLocaleRequest.execute();
    if (this.isCurrentLocaleSet) return result;
    return 'en-US'; // default
  }

  @computed get hasLoadedCurrentLocale(): boolean {
    return (
      this.getProfileLocaleRequest.wasExecuted && this.getProfileLocaleRequest.result !== null
    );
  }

  @computed get isCurrentLocaleSet(): boolean {
    return (this.getProfileLocaleRequest.result != null && this.getProfileLocaleRequest.result !== '');
  }

  _redirectToLanguageSelectionIfNoLocaleSet = () => {
    const { isConnected } = this.stores.networkStatus;
    if (isConnected && this.hasLoadedCurrentLocale && !this.isCurrentLocaleSet) {
      this.actions.router.goToRoute.trigger({ route: ROUTES.PROFILE.LANGUAGE_SELECTION });
    }
  };

  _redirectToLoadingScreenWhenDisconnected = () => {
    if (!this.stores.networkStatus.isConnected) {
      this.actions.router.goToRoute.trigger({ route: ROUTES.ROOT });
    }
  };

  _updateLocale = async ({ locale }: { locale: string }) => {
    await this.setProfileLocaleRequest.execute(locale);
    await this.getProfileLocaleRequest.execute();
  };

  _updateRouteLocation = (options: { route: string, params: ?Object }) => {
    const routePath = buildRoute(options.route, options.params);
    const currentRoute = this.stores.router.location.pathname;
    if (currentRoute !== routePath) this.stores.router.push(routePath);
  };

  _redirectToMainUiAfterLocaleIsSet = () => {
    if (this.isCurrentLocaleSet && this._isOnLanguageSelectionPage()) {
      this._redirectToRoot();
    }
  };

  _isOnLanguageSelectionPage = () => this.currentRoute === ROUTES.PROFILE.LANGUAGE_SELECTION;

  _redirectToRoot = () => {
    this.actions.router.goToRoute.trigger({ route: ROUTES.ROOT });
  };

}
