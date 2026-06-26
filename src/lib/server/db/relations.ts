import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	auditLogsInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.auditLogsInAuth.userId,
			to: r.usersInAuth.id
		})
	},
	usersInAuth: {
		auditLogsInAuths: r.many.auditLogsInAuth(),
		oneTimeTokensInAuths: r.many.oneTimeTokensInAuth(),
		sessionTokensInAuths: r.many.sessionTokensInAuth(),
		userSubscriptionsInAuths: r.many.userSubscriptionsInAuth(),
		dailyStatsInUsers: r.many.dailyStatsInUsers(),
		statsInUsers: r.many.statsInUsers(),
		itemsInClasses: r.many.itemsInClass(),
		tracksInClasses: r.many.tracksInClass(),
		xpEventsInUsers: r.many.xpEventsInUsers()
	},
	oneTimeTokensInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.oneTimeTokensInAuth.userId,
			to: r.usersInAuth.id
		})
	},
	sessionTokensInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.sessionTokensInAuth.userId,
			to: r.usersInAuth.id
		})
	},
	userSubscriptionsInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.userSubscriptionsInAuth.userId,
			to: r.usersInAuth.id
		})
	},
	itemsInClass: {
		modulesInClass: r.one.modulesInClass({
			from: r.itemsInClass.moduleId,
			to: r.modulesInClass.id
		}),
		usersInAuths: r.many.usersInAuth({
			from: r.itemsInClass.id.through(r.submissionInUsers.itemId),
			to: r.usersInAuth.id.through(r.submissionInUsers.userId)
		})
	},
	modulesInClass: {
		itemsInClasses: r.many.itemsInClass(),
		tracksInClass: r.one.tracksInClass({
			from: r.modulesInClass.trackId,
			to: r.tracksInClass.id
		})
	},
	tracksInClass: {
		modulesInClasses: r.many.modulesInClass(),
		topicsInClass: r.one.topicsInClass({
			from: r.tracksInClass.topicId,
			to: r.topicsInClass.id
		}),
		usersInAuths: r.many.usersInAuth({
			from: r.tracksInClass.id.through(r.trackInUsers.trackId),
			to: r.usersInAuth.id.through(r.trackInUsers.userId)
		})
	},
	topicsInClass: {
		tracksInClasses: r.many.tracksInClass()
	},
	dailyStatsInUsers: {
		usersInAuth: r.one.usersInAuth({
			from: r.dailyStatsInUsers.userId,
			to: r.usersInAuth.id
		})
	},
	statsInUsers: {
		usersInAuth: r.one.usersInAuth({
			from: r.statsInUsers.userId,
			to: r.usersInAuth.id
		})
	},
	xpEventsInUsers: {
		usersInAuth: r.one.usersInAuth({
			from: r.xpEventsInUsers.userId,
			to: r.usersInAuth.id
		})
	},
	trackInUsers: {
		tracksInClass: r.one.tracksInClass({
			from: r.trackInUsers.trackId,
			to: r.tracksInClass.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.trackInUsers.userId,
			to: r.usersInAuth.id
		})
	},
	submissionInUsers: {
		itemsInClass: r.one.itemsInClass({
			from: r.submissionInUsers.itemId,
			to: r.itemsInClass.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.submissionInUsers.userId,
			to: r.usersInAuth.id
		})
	}
}));
