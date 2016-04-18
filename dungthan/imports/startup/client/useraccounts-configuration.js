import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({
	defaultTemplate: 'Auth_page',
	defaultLayout: 'App_body',
	defaultContentRegion: 'main',
	defaultLayoutRegions: {},
});