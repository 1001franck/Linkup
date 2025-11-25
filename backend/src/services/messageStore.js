import supabase from "../database/db.js";
import logger from "../utils/logger.js";

async function createMessage({ id_sender, id_receiver, content }) {
	try {
		const { data, error } = await supabase
			.from('message')
			.insert({
				content: String(content).trim(),
				id_sender,
				id_receiver,
				send_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			logger.error("createMessage error:", error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error("createMessage error:", err);
		throw err;
	}
}

async function getMessagesBetweenUsers(id_user1, id_user2) {
	try {
		const { data, error } = await supabase
			.from("message")
			.select("*")
			.or(`and(id_sender.eq.${id_user1},id_receiver.eq.${id_user2}),and(id_sender.eq.${id_user2},id_receiver.eq.${id_user1})`)
			.order("send_at", { ascending: true });

		if (error) {
			logger.error("getMessagesBetweenUsers error:", error);
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error("getMessagesBetweenUsers error:", err);
		throw err;
	}
}

async function getMessagesByUser(id_user) {
	try {
		const { data, error } = await supabase
			.from("message")
			.select("*")
			.or(`id_sender.eq.${id_user},id_receiver.eq.${id_user}`)
			.order("send_at", { ascending: false });

		if (error) {
			logger.error("getMessagesByUser error:", error);
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error("getMessagesByUser error:", err);
		throw err;
	}
}

async function getConversationsForUser(id_user) {
	try {
		const { data: messages, error } = await supabase
			.from("message")
			.select("*")
			.or(`id_sender.eq.${id_user},id_receiver.eq.${id_user}`)
			.order("send_at", { ascending: false });

		if (error) {
			logger.error("getConversationsForUser error:", error);
			throw error;
		}

		// Grouper par correspondant et calculer les messages non lus
		const conversations = {};
		(messages || []).forEach((msg) => {
			const other_user_id = msg.id_sender === id_user ? msg.id_receiver : msg.id_sender;
			if (!conversations[other_user_id]) {
				conversations[other_user_id] = {
					other_user_id: other_user_id,
					last_message: msg,
					unread_count: 0,
				};
			}
			
			// Compter les messages non lus (messages reçus par l'utilisateur et non lus)
			if (msg.id_receiver === id_user && !msg.is_read) {
				conversations[other_user_id].unread_count++;
			}
		});

		return Object.values(conversations);
	} catch (err) {
		logger.error("getConversationsForUser error:", err);
		throw err;
	}
}

async function markAsRead(id_message, id_user) {
	try {
		const { data, error } = await supabase
			.from("message")
			.update({
				is_read: true,
				read_at: new Date().toISOString(),
			})
			.eq("id_message", id_message)
			.eq("id_receiver", id_user)
			.select()
			.single();

		if (error) {
			logger.error("markAsRead error:", error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error("markAsRead error:", err);
		throw err;
	}
}

async function deleteMessage(id_message, id_user) {
	try {
		const { error } = await supabase.from("message").delete().eq("id_message", id_message).or(`id_sender.eq.${id_user},id_receiver.eq.${id_user}`);

		if (error) {
			logger.error("deleteMessage error:", error);
			throw error;
		}

		return true;
	} catch (err) {
		logger.error("deleteMessage error:", err);
		throw err;
	}
}

export { createMessage, getMessagesBetweenUsers, getMessagesByUser, getConversationsForUser, markAsRead, deleteMessage };