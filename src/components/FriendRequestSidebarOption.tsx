'use client';

import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

interface FriendRequestSidebarOptionProps {
	sessionId: string;
	initialUnseenRequestCount: number;
}

const FriendRequestSidebarOption: FC<FriendRequestSidebarOptionProps> = ({
	sessionId,
	initialUnseenRequestCount,
}) => {
	const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
		initialUnseenRequestCount
	);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_requests`)
		);

		const friendRequestHandler = () => {
			setUnseenRequestCount((prev) => prev + 1);
		};

		pusherClient.bind('incoming_friend_requests', friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
		};
	}, [sessionId]);

	return (
		<Link
			href="/dashboard/requests"
			className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
		>
			<div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-md bg-white">
				<User className="h-4 w-4" />
			</div>

			<p className="truncate">Friend requests</p>

			{unseenRequestCount > 0 && (
				<div className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs text-white">
					{unseenRequestCount}
				</div>
			)}
		</Link>
	);
};

export default FriendRequestSidebarOption;
