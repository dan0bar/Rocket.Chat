import type {
	IRoom,
	IStats,
	IUser,
	VideoConference,
	VideoConferenceCapabilities,
	VideoConferenceCreateData,
	VideoConferenceInstructions,
} from '@rocket.chat/core-typings';
import type { PaginatedResult } from '@rocket.chat/rest-typings';

export type VideoConferenceJoinOptions = {
	mic?: boolean;
	cam?: boolean;
};

export interface IVideoConfService {
	create(data: VideoConferenceCreateData): Promise<VideoConferenceInstructions>;
	start(caller: IUser['_id'], rid: string, options: { title?: string; allowRinging?: boolean }): Promise<VideoConferenceInstructions>;
	join(uid: IUser['_id'] | undefined, callId: VideoConference['_id'], options: VideoConferenceJoinOptions): Promise<string>;
	cancel(uid: IUser['_id'], callId: VideoConference['_id']): Promise<void>;
	get(callId: VideoConference['_id']): Promise<Omit<VideoConference, 'providerData'> | null>;
	getUnfiltered(callId: VideoConference['_id']): Promise<VideoConference | null>;
	list(roomId: IRoom['_id'], pagination?: { offset?: number; count?: number }): Promise<PaginatedResult<{ data: VideoConference[] }>>;
	setProviderData(callId: VideoConference['_id'], data: VideoConference['providerData'] | undefined): Promise<void>;
	setEndedBy(callId: VideoConference['_id'], endedBy: IUser['_id']): Promise<void>;
	setEndedAt(callId: VideoConference['_id'], endedAt: Date): Promise<void>;
	setStatus(callId: VideoConference['_id'], status: VideoConference['status']): Promise<void>;
	addUser(callId: VideoConference['_id'], userId?: IUser['_id'], ts?: Date): Promise<void>;
	listProviders(): Promise<{ key: string; label: string }[]>;
	listCapabilities(): Promise<{ providerName: string; capabilities: VideoConferenceCapabilities }>;
	listProviderCapabilities(providerName: string): Promise<VideoConferenceCapabilities>;
	declineLivechatCall(callId: VideoConference['_id']): Promise<boolean>;
	diagnoseProvider(uid: string, rid: string, providerName?: string): Promise<string | undefined>;
	getStatistics(): Promise<IStats['videoConf']>;
}
