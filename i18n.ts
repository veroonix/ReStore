import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: {
      translation: {
        mainTitle: "Marketplace",
        addAd: "Post Ad",
        price: "Price/Exchange",
        settings: "Settings",
        darkTheme: "Dark Mode",
        lang: "Language",
        noAds: "No ads yet",
        appearance: "Appearance",
        appSettings: "Application",
        details: "Details",
        edit: "Edit",
        delete: "Delete",
        
        editAd: "Edit Ad",
        title: "Title",
        description: "Description",
  
        placeholderTitle: "Enter title",
        placeholderDescription: "Enter description",
        placeholderPrice: "Enter price",
        add: "Add",
        update: "Update",
        saving: "Saving...",
        success: "Success",
        error: "Error",
        adAdded: "Ad added successfully",
        adUpdated: "Ad updated successfully",
        failedSaveAd: "Failed to save ad",
        failedLoadAd: "Failed to load ad",
        titleRequired: "Title is required",
      }
    },
    ru: {
      translation: {
        mainTitle: "Объявления",
        addAd: "Подать объявление",
        price: "Цена/Обмен",
        settings: "Настройки",
        darkTheme: "Темная тема",
        lang: "Язык",
        noAds: "Объявлений пока нет",
        appearance: "Внешний вид",
        appSettings: "Приложение",
        details: "Детали",
        edit: "Редактировать",
        delete: "Удалить",
        editAd: "Редактировать объявление",
        title: "Название",
        description: "Описание",
        placeholderTitle: "Введите название",
        placeholderDescription: "Введите описание",
        placeholderPrice: "Введите цену",
        add: "Добавить",
        update: "Обновить",
        saving: "Сохранение...",
        success: "Успех",
        error: "Ошибка",
        adAdded: "Объявление добавлено",
        adUpdated: "Объявление обновлено",
        failedSaveAd: "Не удалось сохранить объявление",
        failedLoadAd: "Не удалось загрузить объявление",
        titleRequired: "Название обязательно",
        
      }
    }
  },
  lng: 'ru',
  fallbackLng: 'en',
});

export default i18n;