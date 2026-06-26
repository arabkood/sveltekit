import { relations } from 'drizzle-orm/relations';
import {
	usersInAuth,
	sessionTokensInAuth,
	topicsInClass,
	tracksInClass,
	auditLogsInAuth,
	statsInUsers,
	modulesInClass,
	itemsInClass,
	submissionInUsers,
	xpEventsInUsers,
	dailyStatsInUsers,
	oneTimeTokensInAuth,
	trackInUsers,
	userSubscriptionsInAuth
} from './schema';

export const sessionTokensInAuthRelations = relations(sessionTokensInAuth, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [sessionTokensInAuth.userId],
		references: [usersInAuth.id]
	})
}));

export const usersInAuthRelations = relations(usersInAuth, ({ one, many }) => ({
	sessionTokensInAuths: many(sessionTokensInAuth),
	auditLogsInAuths: many(auditLogsInAuth),
	statsInUsers: many(statsInUsers),
	submissionInUsers: many(submissionInUsers),
	xpEventsInUsers: many(xpEventsInUsers),
	dailyStatsInUsers: many(dailyStatsInUsers),
	oneTimeTokensInAuths: many(oneTimeTokensInAuth),
	trackInUsers: many(trackInUsers),
	userSubscriptionsInAuth: one(userSubscriptionsInAuth)
}));

export const userSubscriptionsInAuthRelations = relations(userSubscriptionsInAuth, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [userSubscriptionsInAuth.userId],
		references: [usersInAuth.id]
	})
}));

export const tracksInClassRelations = relations(tracksInClass, ({ one, many }) => ({
	topicsInClass: one(topicsInClass, {
		fields: [tracksInClass.topicId],
		references: [topicsInClass.id]
	}),
	modulesInClasses: many(modulesInClass),
	trackInUsers: many(trackInUsers)
}));

export const topicsInClassRelations = relations(topicsInClass, ({ many }) => ({
	tracksInClasses: many(tracksInClass)
}));

export const auditLogsInAuthRelations = relations(auditLogsInAuth, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [auditLogsInAuth.userId],
		references: [usersInAuth.id]
	})
}));

export const statsInUsersRelations = relations(statsInUsers, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [statsInUsers.userId],
		references: [usersInAuth.id]
	})
}));

export const modulesInClassRelations = relations(modulesInClass, ({ one, many }) => ({
	tracksInClass: one(tracksInClass, {
		fields: [modulesInClass.trackId],
		references: [tracksInClass.id]
	}),
	itemsInClasses: many(itemsInClass)
}));

export const itemsInClassRelations = relations(itemsInClass, ({ one, many }) => ({
	modulesInClass: one(modulesInClass, {
		fields: [itemsInClass.moduleId],
		references: [modulesInClass.id]
	}),
	submissionInUsers: many(submissionInUsers)
}));

export const submissionInUsersRelations = relations(submissionInUsers, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [submissionInUsers.userId],
		references: [usersInAuth.id]
	}),
	itemsInClass: one(itemsInClass, {
		fields: [submissionInUsers.itemId],
		references: [itemsInClass.id]
	})
}));

export const xpEventsInUsersRelations = relations(xpEventsInUsers, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [xpEventsInUsers.userId],
		references: [usersInAuth.id]
	})
}));

export const dailyStatsInUsersRelations = relations(dailyStatsInUsers, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [dailyStatsInUsers.userId],
		references: [usersInAuth.id]
	})
}));

export const oneTimeTokensInAuthRelations = relations(oneTimeTokensInAuth, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [oneTimeTokensInAuth.userId],
		references: [usersInAuth.id]
	})
}));

export const trackInUsersRelations = relations(trackInUsers, ({ one }) => ({
	usersInAuth: one(usersInAuth, {
		fields: [trackInUsers.userId],
		references: [usersInAuth.id]
	}),
	tracksInClass: one(tracksInClass, {
		fields: [trackInUsers.trackId],
		references: [tracksInClass.id]
	})
}));
