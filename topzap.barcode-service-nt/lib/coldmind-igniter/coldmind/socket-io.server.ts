/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as IOServer              from "socket.io";
import * as http                  from "http";
import * as net                   from "net";
import { IOTypes }                from './socket-io.types';
import { SocketEvents }           from '@igniter/coldmind/igniter-event.types';
import { EventEmitter }           from 'events';
import { Server, Socket }         from 'socket.io';
import { IgniterSettings }        from '@igniter/igniter.settings';
import {IgniterMessage, IMessage} from '@igniter/messaging/igniter-messages';
import { MessageUtils }           from '@igniter/messaging/message-utils';
import {MessageType} from '@igniter/messaging/message-types';

export class SocketEntry {
	constructor(public sessionId: string,
				public socket: Socket) {}
}

export interface ISocketServer {
	startListen(port: number): void;
	sendToSession(sessId: string, message: IMessage): boolean;
	onServerStarted(listener: any): void;
	onServerStartError(listener: any): void;
	onNewConnection(listener: any): void;
	onDisconnect(listener: any): void;
	onEvent(listener: any): void;
	onMessage(listener: any): void;
	onError(listener: any): void;
}

export class SocketServer implements ISocketServer {
	public io: IOServer.Server;
	private eventEmitter: EventEmitter;
	httpServer: net.Server;
 	serverPort: number = IgniterSettings.DefSocketServerPort;
	sessionSockets: SocketEntry[];

	constructor(createServer: boolean = true) {
		this.eventEmitter = new EventEmitter();
		this.sessionSockets = new Array<SocketEntry>();

		if (createServer) {
			this.createServer();
		}
	}

	private getSessionSocketEntry(sessId: string): SocketEntry {
		let result: SocketEntry = null;

		for (const entry of this.sessionSockets) {
			if (entry.sessionId === sessId) {
				result = entry;
				break;
			}
		}

		return result;
	}

	private setSessionSocket(sessId: string, socket: Socket): boolean {
		let entry: SocketEntry = this.getSessionSocketEntry(sessId);

		if (entry !== null) {
			return false;
		}

		entry = new SocketEntry(sessId, socket);
		this.sessionSockets.push(entry);

		return true;
	}

	private removeSessionSocket(sessId: string): boolean {
		let result = false;

		for (let i = 0; i < this.sessionSockets.length; i++) {
			let entry = this.sessionSockets[i];
			if (entry.sessionId === sessId) {
				this.sessionSockets.splice(i, 1);
				result = true;
				break;
			}
		}

		return result;
	}

	public sendToSession(sessId: string, message: IMessage): boolean {
		let entry: SocketEntry = this.getSessionSocketEntry(sessId);
		console.log("sendToSession :: sessId ::", sessId);

		if (entry === null) {
			return false;
		}

		console.log("emitting :: socketId ::", entry.socket.id);
		entry.socket.emit(IOTypes.SOCKET_IO_MESSAGE, message);

		return true;
	}

	public createServer() {
		let httpServer = http.createServer();

		httpServer.on('listening', () => {
			console.log("IOServer Listening on port ::", this.serverPort);
			this.eventEmitter.emit(SocketEvents.ServerStarted, this.serverPort);
		});

		httpServer.on("error", (err) => {
			console.log("IOServer Start Failed ::", err);
			this.eventEmitter.emit(SocketEvents.ServerStartError, err);
		});

		console.log("pok 1");

		const io = require('socket.io')({
//			path: "/" + serverPath,
			serveClient: false,
		});

		io.attach(httpServer, {
			pingInterval: 10000,
			pingTimeout: 5000,
			cookie: true
		});

		this.attachSocketIO(io);

		this.httpServer = httpServer;

		/*

		let options = {
			path: '/igniter',
			serveClient: false,
			// below are engine.IO options
			pingInterval: 10000,
			pingTimeout: 5000,
			cookie: false
		};

		const io = new IOServer(); //httpServer, options);
		io(httpServer, options);
		*/
	}

	public attachSocketIO(socket: Server): void {
		socket.on(IOTypes.SOCKET_IO_CONNECTION, this.onConnect.bind(this));
		this.io = socket;
	}

	public startListen(port: number): void {
		this.httpServer.listen(port);
	}

	private onConnect(socket: any) { //SocketIOClient.Socket) {
		console.log("SERVER :: New Client Connected ::", socket.id);
		console.log("SERVER :: SESSION ID ::", socket.request.sessionID);

		this.setSessionSocket(socket.request.sessionID, socket);
		this.handleConnection(socket);
	}

	private socketDisconnect(socket: any = null): void {
		console.log("SERVER->DISCONNECT :: SESSION ID ::", socket.request.sessionID);

		this.removeSessionSocket(socket.request.sessionID);
		this.eventEmitter.emit(SocketEvents.SocketDisconnect, socket);
	}

	private handleConnection(socket: any) {
		this.eventEmitter.emit(SocketEvents.NewConnection, socket);

		socket.on(IOTypes.SOCKET_IO_DISCONNECT, () => {
			this.socketDisconnect(socket);
		});

		socket.on(IOTypes.SOCKET_IO_MESSAGE, (data) => {
			console.log("<< SERVER :: NEW MESSAGE ::", data);
			this.handleMessage(data, socket);
		});
	}

	private handleMessage(message: any, socket: Socket) {
		let dataObj: any = message;

		try {
			if (typeof message === "string") {
				dataObj = JSON.parse(message);
			}

			if (MessageUtils.validateMessageType(dataObj) === false) {
				let errMessage = "Invalid Message Type, does not conform to IgniterMessage";
				this.eventEmitter.emit(SocketEvents.Error, errMessage, message);
				return;
			}

		} catch (ex) {
			console.log("Error in handleMessage:: ", message);
			console.log("handleMessage parse failed:", ex);
			this.eventEmitter.emit(SocketEvents.Error, "handleMessage", ex);
			return;
		}

		let igniterMessage = new IgniterMessage(dataObj.type, dataObj.id, dataObj.data, dataObj.tag);

		// Attach Session ?
		if (dataObj.session) {
			igniterMessage.session = dataObj.session;
		}

		igniterMessage.socket = socket; // Attach socket so that we can reply from within the message

		this.eventEmitter.emit(SocketEvents.NewMessage, igniterMessage);
	}

	public onServerStarted(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.ServerStarted, listener);
	}

	public onServerStartError(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.ServerStartError, listener);
	}

	public onNewConnection(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.NewConnection, listener);
	}

	public onDisconnect(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.SocketDisconnect, listener);
	}

	public onEvent(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.NewEvent, listener);
	}

	public onMessage(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.NewMessage, listener);
	}

	public onError(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.Error, listener);
	}
}

/*
let args = process.argv.slice(2);
console.log("args", args);
*/

//let server = new SocketServer(IgniterSettings.DefSocketPath);
