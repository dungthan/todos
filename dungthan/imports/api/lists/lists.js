import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import { Todos } from '../todos/todos.js';

class ListsCollection extend Mongo.Collection {
	insert(list, callback) {
		const ourList = list;
		if (!ourList.name) {
			let nextLetter = 'A';
			ourList.name = `List ${nextLetter}`;

			while (!!this.findOne({name: ourList.name})) {
				// not going to be too smart here, can go past Z
				nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
				ourList.name = `List ${nextLetter}`;
			}
		}

		return super.insert(ourList, callback);
	}
	remove(selector, callback) {
		Todos.remove({ listId: selector });
		return super.remove(selector, callback);
	}
}

export const Lists = new ListsCollection('Lists');

// Deny all client-side update since we will be using methods to manage this collection
Lists.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
});

Lists.schema = new SimpleSchema({
	name: { type: String },
	incompleteCount: { type: Number, defaultValue: 0 },
	userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
});

Lists.attachSchema(Lists.schema);

/* 
	This represents the key from Lists object that should be published
	to the client. If we add secret properties to List objects, don't list
	them here to keep them private to server
*/
Lists.publicFields = {
	name: 1,
	incompleteCount: 1,
	userId: 1,
};

Factory.define('list', Lists, {});

Lists.helpers({
	// A list is considered to be private if it has a userId set
	isPrivate() {
		return !!this.userId;
	},
	
});