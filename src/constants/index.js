export const LANDING = '/';
export const SIGN_UP = '/signup';
export const LOGIN = '/login';
export const PASSWORD_FORGET = '/pw-forget';
export const HOME = '/home';
export const ACCOUNT = '/account';
export const SETTINGS = '/settings';
export const CHAT = '/chat';
export const authCondition = (authUser) => !!authUser;
export default {
	LANDING,
	SIGN_UP,
	LOGIN,
	PASSWORD_FORGET,
	CHAT,
	HOME,
	ACCOUNT,
	SETTINGS,
	authCondition
}