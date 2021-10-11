/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventEmitter } from 'events';
import {
	Driver,
	Lobby,
	Method,
	Room,
	User,
	UserProfile,
} from '@karuta/core';

export default class MockUser extends EventEmitter implements User {
	constructor(protected room: Room, protected id: number, protected name: string) {
		super();

		this.room = room;
		this.id = id;
		this.name = name;
	}

	getRoom(): Room {
		return this.room;
	}

	getId(): number {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	on(event: 'disconnected', listener: () => void): this {
		throw new Error('Method not implemented.');
	}

	once(event: 'disconnected', listener: () => void): this {
		throw new Error('Method not implemented.');
	}

	off(event: 'disconnected', listener: () => void): this {
		throw new Error('Method not implemented.');
	}

	emit(event: 'disconnected'): boolean {
		throw new Error('Method not implemented.');
	}

	setName(name: string): void {
		throw new Error('Method not implemented.');
	}

	setRoom(room?: Room): void {
		throw new Error('Method not implemented.');
	}

	getLobby(): Lobby {
		throw new Error('Method not implemented.');
	}

	getDriver(): Driver<unknown> {
		throw new Error('Method not implemented.');
	}

	isConnected(): boolean {
		throw new Error('Method not implemented.');
	}

	logout(): void {
		throw new Error('Method not implemented.');
	}

	getProfile(): UserProfile {
		throw new Error('Method not implemented.');
	}

	setRequestTimeout(timeout?: number): void {
		throw new Error('Method not implemented.');
	}

	getRequestTimeout(): number {
		throw new Error('Method not implemented.');
	}

	get(context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	head(context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	post(context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	put(context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	patch(context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	delete(context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	request(method: Method, context: number, params?: unknown): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	notify(method: Method, context: number, params?: unknown): void {
		throw new Error('Method not implemented.');
	}
}
