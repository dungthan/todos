import './add-body.html';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Lists } from '../../api/lists/lists.js';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { insert } from '../../api/lists/methods.js';

import '../components/loading.js';

const CONNECTION_ISSUE_TIMEOUT = 5000;

// A store which is local to this file?
const showConnectionIssue = new ReactiveVar(false);

Meteor.startup(() => {
	// Only show the connection error box if it has been 5 seconds since
	// the app startd
	setTimeout(() => {
		// FIXME:
		// Launch screen handle created in lib/router.js
		// dataReadyHold.release();

		// Show the connection error box
		showConnectionIssue.set(true);
	}, CONNECTION_ISSUE_TIMEOUT);
});

Template.App_body.onCreated(function appBodyOnCreated() {
	this.subscribe('lists.public');
	this.subscribe('lists.private');

	this.state = new ReactiveDict();
	this.state.setDefault({
		menuOpen: false,
		userMenuOpen: false,
	});
});

Template.App_body.helpers({
	menuOpen() {
		const instance = Template.instance();
		return instance.state.get('menuOpen') && 'menu-open';
	},
	cordova() {
		return Meteor.isCordova && 'cordova';
	},
	emailLocalPart() {
		const email = Meteor.user().email[0].address;
		return email.substring(0, email.indexOf('@'));
	},
	userMenuOpen() {
		const instance = Template.instance();
		return instance.state.get('userMenuOpen');
	},
	lists() {
		return Lists.find({ $or: [
			{ userId: { $exists: false } },
			{ userId: Meteor.userId() },
		] });
	},
	activeListClass(list) {
		const active = ActiveRoute.name('Lists.show')
			&& FlowRouter.getParam('_id') === list._id;

		return active && 'active';
	},
	connected() {
		if (showConnectionIssue.get()) {
			return Meteor.status().connected;
		}

		return true;
	},
	templateGestures: {
		'swiperleft .cordova'(event, instance) {
			instance.state.set('menuOpen', false);
		},
		'swiperright .cordova'(event, instance) {
			instance.state.set('menuOpen', true);
		},
	},
});

