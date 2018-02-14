export const LANDING = '/';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const PASSWORD_FORGET = '/pw-forget';
export const HOME = '/home';
export const ACCOUNT = '/account';
export const SETTINGS = '/settings';
export const authCondition = (authUser) => !!authUser;
export default {
	LANDING,
	SIGN_UP,
	SIGN_IN,
	PASSWORD_FORGET,
	HOME,
	ACCOUNT,
	SETTINGS,
	authCondition
}