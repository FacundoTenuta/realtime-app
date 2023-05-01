'use client';

import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

interface FriendRequestsProps {
	incomingFriendRequests: IncomingFriendRequest[];
	sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
	incomingFriendRequests,
	sessionId,
}) => {
	const router = useRouter();

	const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
		incomingFriendRequests
	);

	const handleAcceptFriend = async (senderId: string) => {
		const response = await axios.post('/api/friends/accept', {
			id: senderId,
		});

		setFriendRequests((prev) =>
			prev.filter((friendRequest) => {
				return friendRequest.senderId !== senderId;
			})
		);

		router.refresh();
	};

	const handleDeclineFriend = async (senderId: string) => {
		const response = await axios.post('/api/friends/decline', {
			id: senderId,
		});

		setFriendRequests((prev) =>
			prev.filter((friendRequest) => {
				return friendRequest.senderId !== senderId;
			})
		);

		router.refresh();
	};

	return (
		<>
			{friendRequests.length === 0 ? (
				<p className="text-sm text-zinc-500">No friend requests</p>
			) : (
				friendRequests.map((friendRequest) => {
					return (
						<div key={friendRequest.senderId} className="flex gap-4 items-center">
							<UserPlus className="text-black" />
							<p className="font-medium text-lg">{friendRequest.senderEmail}</p>
							<button
								aria-label="Accept friend"
								className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
								onClick={() => handleAcceptFriend(friendRequest.senderId)}
							>
								<Check className="font-semibold text-white w-3/4 h-3/4" />
							</button>
							<button
								aria-label="Decline friend"
								className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
								onClick={() => handleDeclineFriend(friendRequest.senderId)}
							>
								<X className="font-semibold text-white w-3/4 h-3/4" />
							</button>
						</div>
					);
				})
			)}
		</>
	);
};

export default FriendRequests;
