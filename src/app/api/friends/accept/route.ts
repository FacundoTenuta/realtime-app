import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { id: idToAdd } = z
			.object({
				id: z.string(),
			})
			.parse(body);

		const session = await getServerSession(authOptions);

		if (!session) {
			return new Response('Unauthorized', {
				status: 401,
				statusText: 'Unauthorized',
			});
		}

		const isAlreadyFriends = await fetchRedis(
			'sismember',
			`user:${session.user.id}:friends`
		);

		if (isAlreadyFriends) {
			return new Response('Already friends', {
				status: 400,
				statusText: 'Already friends',
			});
		}
	} catch (error) {}
}
