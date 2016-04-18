import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

FlowRouter.route('/lists/:_id', {
	name: 'List.show',
	action() {
		BlazeLayout.render('App_body', {main: 'List_show_page'});
	},
});

FlowRouter.route('/', {
	name: 'App.home',
	action() {
		BlazeLayout.render('App_body', { main: 'app_rootRedirector' });
	},
});

FlowRouter.notFound = {
	action() {
		BlazeLayout.render('App_body', { main: 'App_notFound' });
	}
};

AccountsTemplates.configureRoute('signIn', {
	name: 'signin',
	path: '/signin',
});

AccountsTemplates.configureRoute('signUp', {
	name: 'join',
	path: '/join',
});

AccountsTemplates.configureRoute('forgotPwd');

AccountsTemplates.configureRoute('resetPwd', {
	name: 'resetPwd',
	path: '/reset-password',
})