import commonTranslations from "../public/locales/en/common.json";
import authTranslations from "../public/locales/en/auth.json";
import homeTranslations from "../public/locales/en/home.json";
import messagesTranslations from "../public/locales/en/messages.json";
import navigationTranslations from "../public/locales/en/navigation.json";
import adminTranslations from "../public/locales/en/admin.json";

const translationResources = {
  common: commonTranslations,
  auth: authTranslations,
  home: homeTranslations,
  messages: messagesTranslations,
  navigation: navigationTranslations,
  admin: adminTranslations,
}

declare module "react-i18next" {
  export interface CustomTypeOptions {
    resources: typeof translationResources
  }
}
