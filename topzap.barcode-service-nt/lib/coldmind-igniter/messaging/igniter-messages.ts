/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { MessageType }            from '@igniter/messaging/message-types';
import { Socket }                 from 'socket.io';
import { SocketEvents }           from '@igniter/coldmind/igniter-event.types';
import { IOTypes }                from '@igniter/coldmind/socket-io.types';

export interface IgniterMessageType {
	type: string;
	id: string;
	data?: null;
	tag:  null;
}

// Converts JSON strings to/from your types
export namespace IgniterMessageType {
	export function toIgniterMessageType(json: string): IgniterMessageType {
		return JSON.parse(json);
	}

	export function igniterMessageTypeToJson(value: IgniterMessageType): string {
		return JSON.stringify(value);
	}
}

export interface IMessage {
	type: string;
	id: string;
	data: any;
	tag: string;
	session: string;
	socket: Socket;

	is(type: string): boolean;
	idIs(id: string): boolean;
	ack(): void;
	reply(type: string, id: string, data: any): void;
	error(error: Error): void;
}

export class IgniterMessage implements IMessage {
	session: string;
	socket: Socket;

	constructor(public type: string,
				public id: string,
				public data: any,
				public tag: string = null) {
	}

	public is(type: string): boolean {
		return (this.type === type);
	}

	public idIs(id: string): boolean {
		return (this.id === id);
	}

	public ack(): void {
		let igniterMessage = new IgniterMessage(MessageType.Ack, this.id, null, this.tag);
		this.socket.emit(IOTypes.SOCKET_IO_MESSAGE, igniterMessage);
		console.log("Ack Message Done");
	}

	public reply(type: string, id: string, data: any = null): void {
		let igniterMessage = new IgniterMessage(type, id, data, this.tag);
		console.log("Reply Message ::", igniterMessage);
		this.socket.emit(IOTypes.SOCKET_IO_MESSAGE, igniterMessage);
	}

	public error(error: Error): void {
		this.reply(MessageType.Error, "error", JSON.stringify(error));
	}
}
