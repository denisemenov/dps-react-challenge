import { useEffect, useState, ChangeEvent } from 'react';

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
	const [cities, setCities] = useState<string[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [nameInput, setNameInput] = useState<string>('');
	const [cityInput, setCityInput] = useState<string>('');

	useEffect(() => {
		fetch('https://dummyjson.com/users')
			.then((response) => response.json())
			.then(({ users }) => {
				const updatedUsers = users.map((u: User) => {
					return {
						id: u.id,
						name: `${u.firstName} ${u.lastName}`,
						birthday: u.birthDate,
						city: u.address.city,
					};
				});
				setUsers(updatedUsers);

				const updatedCities: string[] = [
					...(new Set(
						users.map((u: User) => u.address.city)
					) as Set<string>),
				];

				setCities(updatedCities);
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
					u.name.toLowerCase().includes(nameInput.toLowerCase()) &&
					u.city.toLowerCase().includes(cityInput.toLowerCase())
			)
		);
	}, [users, nameInput, cityInput]);

	const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
		setNameInput(e.target.value);
	};

	const handleCityInput = (e: ChangeEvent<HTMLSelectElement>) => {
		setCityInput(e.target.value);
	};

	if (loading) {
		return (
			<div className="container max-w-3xl p-8 flex items-center justify-center min-h-screen">
				<div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-slate-600 rounded-full">
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
		<div className="container max-w-4xl p-8 gap-4 flex flex-col">
			<div className="columns-3">
				<input
					type="text"
					id="input-label"
					className="py-3 px-4 block w-full border border-slate-300 rounded-lg text-sm focus:border-slate-600"
					placeholder="Name"
					onChange={handleNameInput}
				/>

				<select
					id="cities"
					className="py-3 px-4 block w-full border border-slate-300 rounded-lg text-sm focus:border-slate-600"
					onChange={handleCityInput}
				>
					<option value="" className="px-4 py-4" selected>
						Choose a city
					</option>

					{cities.map((city) => (
						<option key={city} value={city}>
							{city}
						</option>
					))}
				</select>

				<label
					htmlFor="oldestCheckbox"
					className="flex p-3 w-full bg-white border border-slate-300 rounded-lg text-sm"
				>
					<input
						type="checkbox"
						className="shrink-0 mt-0.5 border-slate-300 rounded"
						id="oldestCheckbox"
					/>

					<span className="text-sm text-slate-800 ms-3">
						Highlight oldest per city
					</span>
				</label>
			</div>

			<div className="border rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-slate-300">
					<thead>
						<tr>
							<th className="px-4 py-2 text-start text-xs font-medium text-slate-600 uppercase">
								Name
							</th>
							<th className="px-4 py-2 text-start text-xs font-medium text-slate-600 uppercase">
								City
							</th>
							<th className="px-4 py-2 text-start text-xs font-medium text-slate-600 uppercase">
								Birthday
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-300">
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<tr key={user.id}>
									<td className="px-4 py-2 text-slate-800">
										{user.name}
									</td>
									<td className="px-4 py-2 text-slate-800">
										{user.city}
									</td>
									<td className="px-4 py-2 text-slate-800">
										{user.birthday}
									</td>
								</tr>
							))
						) : (
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
