import { useEffect, useState } from 'react';

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: string;
	address: { city: string };
}

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch('https://dummyjson.com/users')
			.then((response) => response.json())
			.then((data) => {
				setUsers(data.users);
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			});
	}, []);

	if (loading) {
		return (
			<div className="container max-w-3xl p-8 flex items-center justify-center min-h-screen">
				<div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-slate-600 rounded-full dark:text-slate-500">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container max-w-3xl p-8 flex items-center justify-center min-h-screen">
				<div>Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="container max-w-3xl p-8">
			<div className="border rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-slate-200">
					<thead>
						<tr>
							<th className="px-4 py-2 text-start text-xs font-medium text-slate-500 uppercase">
								Name
							</th>
							<th className="px-4 py-2 text-start text-xs font-medium text-slate-500 uppercase">
								City
							</th>
							<th className="px-4 py-2 text-start text-xs font-medium text-slate-500 uppercase">
								Birthday
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200">
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-4 py-2  text-slate-800">{`${user.firstName} ${user.lastName}`}</td>
								<td className="px-4 py-2  text-slate-800">
									{user.address.city}
								</td>
								<td className="px-4 py-2  text-slate-800">
									{user.birthDate}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default App;
