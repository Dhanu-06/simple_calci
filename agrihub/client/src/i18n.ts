import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
	en: {
		translation: {
			farmer: 'Farmer',
			buyer: 'Buyer',
			language: 'Language',
			news: 'News',
			marketPrice: 'Market Price',
			resources: 'Resources',
			status: 'Status',
			sell: 'Sell Crops',
			buy: 'Buy Crops',
			aiDetector: 'AI Crop Health',
			login: 'Login',
			signin: 'Sign up',
			home: 'Home'
		}
	},
	hi: {
		translation: {
			farmer: 'किसान',
			buyer: 'खरीदार',
			language: 'भाषा',
			news: 'समाचार',
			marketPrice: 'बाजार मूल्य',
			resources: 'संसाधन',
			status: 'स्थिति',
			sell: 'फसल बेचें',
			buy: 'फसल खरीदें',
			aiDetector: 'एआई फसल स्वास्थ्य',
			login: 'लॉगिन',
			signin: 'साइन अप',
			home: 'होम'
		}
	}
};

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: { escapeValue: false }
});

export default i18n;