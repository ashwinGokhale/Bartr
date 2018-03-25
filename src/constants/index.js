export const LANDING = '/';
export const SIGN_UP = '/signup';
export const LOGIN = '/login';
export const PASSWORD_FORGET = '/pw-forget';
export const HOME = '/home';
export const ACCOUNT = '/account';
export const SETTINGS = '/settings';
export const CHAT = '/chat';
export const CREATE_POST = '/post/create';
export const DISPLAY_POSTS = '/posts'
export const SUPPORT = '/support';
export const TERMS = '/terms';
export const ABOUTUS = '/aboutUs'
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
	CREATE_POST,
	DISPLAY_POSTS,
	SUPPORT,
	TERMS,
	ABOUTUS,
	authCondition

}