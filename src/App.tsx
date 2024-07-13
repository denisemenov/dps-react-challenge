import { useEffect, useState } from 'react';

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: string;
	address: { city: string };
}

export interface FilteredUser {
	id: number;
	name: string;
	birthday: string;
	city: string;
}

function App() {
	const [users, setUsers] = useState<FilteredUser[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [nameInput, setNameInput] = useState<string>('');
	const [cityInput, setCityInput] = useState<string>('');

	useEffect(() => {
		fetch('https://dummyjson.com/users')
			.then((response) => response.json())
			.then(({ users }) => {
				const newArr = users.map((u: User) => {
					return {
						id: u.id,
						name: `${u.firstName} ${u.lastName}`,
						birthday: u.birthDate,
						city: u.address.city,
					};
				});
				setUsers(newArr);
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

	useEffect(() => {
		setFilteredUsers(
			users.filter(
				(u) =>
					u.name.toLowerCase().includes(nameInput) &&
					u.city.toLowerCase().includes(cityInput)
			)
		);
	}, [users, nameInput, cityInput]);

	const handleNameInput = (e) => {
		console.log(e.target.value);
		setNameInput(e.target.value);
	};

	const handleCityInput = (e) => {
		console.log(e.target.value);
		setCityInput(e.target.value);
	};

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
		<div className="container max-w-4xl p-8 gap-4  flex flex-col">
			<div className="columns-3">
				<input
					type="text"
					id="input-label"
					className="py-3 px-4 block w-full border border-slate-200 rounded-lg text-sm focus:border-slate-500 focus:ring-slate-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Name"
					onChange={handleNameInput}
				/>
				<div>
					<input
						type="text"
						id="input-label"
						className="py-3 px-4 block w-full border border-slate-200 rounded-lg text-sm focus:border-slate-500 focus:ring-slate-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="City"
						onChange={handleCityInput}
					/>
				</div>
				<div>
					<label
						htmlFor="hs-checkbox-in-form"
						className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500   "
					>
						<input
							type="checkbox"
							className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
							id="hs-checkbox-in-form"
						/>
						<span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">
							Highlight oldest per city
						</span>
					</label>
				</div>
			</div>

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
						{filteredUsers.length > 0 &&
							filteredUsers.map((user) => (
								<tr key={user.id}>
									<td className="px-4 py-2  text-slate-800">
										{user.name}
									</td>
									<td className="px-4 py-2  text-slate-800">
										{user.city}
									</td>
									<td className="px-4 py-2  text-slate-800">
										{user.birthday}
									</td>
								</tr>
							))}

						{!filteredUsers.length && (
							<tr>
								<td
									className="text-center px-8 py-4 text-slate-800"
									colSpan={3}
								>
									No users found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default App;
