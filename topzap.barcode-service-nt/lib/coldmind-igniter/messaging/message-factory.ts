/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { MessageType }            from '@igniter/messaging/message-types';
import * as uuid4                 from "uuid/v4";
import { IMessage }               from '@igniter/messaging/igniter-messages';
import { IgniterMessage }         from '@igniter/messaging/igniter-messages';

export class MessageFactory {
	public static newIgniterMessage(messageType: string, messageId: string, data: any = null, tag: string = null): IMessage {
		data = data === null ? {} : data;
		tag = tag === null ? uuid4() : tag;
		let message = new IgniterMessage(messageType, messageId, data, tag);
		return message;
	}
}
