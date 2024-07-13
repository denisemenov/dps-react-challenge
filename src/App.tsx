import { useEffect, useState, ChangeEvent } from 'react';
import moment, { Moment } from 'moment';

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
	birthday: Moment;
	city: string;
	isOldest: boolean;
}

function App() {
	const [users, setUsers] = useState<FilteredUser[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [nameInput, setNameInput] = useState<string>('');
	const [debouncedNameInput, setDebouncedNameInput] =
		useState<string>(nameInput);
	const [citySelector, setCitySelector] = useState<string>('');
	const [oldestCheckbox, setOldestCheckbox] = useState<boolean>(false);
	const [sortBy, setSortBy] = useState<string>('');
	const [sortAsc, setSortAsc] = useState<boolean>(true);

	const cols = ['name', 'city', 'birthday'];

	useEffect(() => {
		fetch('https://dummyjson.com/users')
			.then((response) => response.json())
			.then((data) => {
				setUsers(updateUsersList(data.users));

				const updatedCities: string[] = [
					...(new Set(
						data.users.map((u: User) => u.address.city)
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
		let list = users.filter(
			(u) =>
				u.name
					.toLowerCase()
					.includes(debouncedNameInput.toLowerCase()) &&
				u.city.toLowerCase().includes(citySelector.toLowerCase())
		);

		if (sortBy !== '') {
			list = list.sort((a, b) => {
				if (
					a[sortBy as keyof FilteredUser] <
					b[sortBy as keyof FilteredUser]
				) {
					return sortAsc ? -1 : 1;
				}
				if (
					a[sortBy as keyof FilteredUser] >
					b[sortBy as keyof FilteredUser]
				) {
					return sortAsc ? 1 : -1;
				}
				return 0;
			});
		}

		setFilteredUsers(list);
	}, [users, debouncedNameInput, citySelector, sortBy, sortAsc]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedNameInput(nameInput);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [nameInput]);

	const handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
		setNameInput(e.target.value);
	};

	const handleCitySelector = (e: ChangeEvent<HTMLSelectElement>) => {
		setCitySelector(e.target.value);
	};

	const handleOldestCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
		setOldestCheckbox(e.target.checked);
	};

	const handleSortBy = (col: string) => {
		if (sortBy === col) {
			setSortAsc(!sortAsc);
		} else {
			setSortBy(col);
			setSortAsc(true);
		}
	};

	const updateUsersList = (list: User[]) => {
		let updatedList: FilteredUser[] = list.map((u: User) => {
			return {
				id: u.id,
				name: `${u.firstName} ${u.lastName}`,
				birthday: moment(u.birthDate, 'YYYY-MM-DD'),
				city: u.address.city,
				isOldest: false,
			};
		});

		updatedList = updatedList.map((u) => {
			const neighbors = updatedList.filter((i) => u.city === i.city);

			if (neighbors.length === 1) {
				return {
					...u,
					isOldest: neighbors.length === 1 ? true : false,
				};
			} else {
				return {
					...u,
					isOldest: !neighbors.some((i) =>
						moment(i.birthday).isBefore(moment(u.birthday))
					),
				};
			}
		});

		return updatedList;
	};

	if (loading) {
		return (
			<div className="container max-w-3xl p-8 flex items-center justify-center min-h-screen">
				<div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-slate-600 rounded-full">
					<span className="sr-only">Loooooooading... 👀</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container max-w-3xl p-8 flex items-center justify-center min-h-screen">
				<div>☢️ Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="container max-w-4xl p-2 md:p-8 gap-2 md:gap-4 flex flex-col">
			<div className="flex flex-col md:flex-row columns-1 md:columns-3 gap-2 md:gap-4">
				<input
					type="text"
					id="input-label"
					className="py-3 px-4 block w-full border border-slate-300 rounded-lg text-sm focus:border-slate-600 shadow"
					placeholder="Name"
					onChange={handleNameInput}
				/>

				<select
					id="cities"
					className="py-3 px-4 block w-full border border-slate-300 rounded-lg text-sm focus:border-slate-600 shadow"
					onChange={handleCitySelector}
				>
					<option value="" className="px-4 py-4">
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
					className="flex p-3 w-full bg-white border border-slate-300 rounded-lg text-sm  shadow"
				>
					<input
						type="checkbox"
						id="oldestCheckbox"
						onChange={handleOldestCheckbox}
					/>

					<span className="text-sm text-slate-800 ms-3">
						Highlight oldest per city
					</span>
				</label>
			</div>

			<div className="border border-slate-300 rounded-lg overflow-hidden shadow">
				<table className="min-w-full divide-y divide-slate-300">
					<thead>
						<tr className="bg-slate-100">
							{cols.map((col) => (
								<th
									key={col}
									className="px-2 md:px-4 py-2 text-start text-xs font-medium text-slate-600 uppercase cursor-pointer"
									onClick={() => handleSortBy(col)}
								>
									{col}
									&nbsp;
									{sortBy === col
										? sortAsc
											? '⬇️'
											: '⬆️'
										: ''}
								</th>
							))}
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-300">
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<tr
									key={user.id}
									className={
										user.isOldest && oldestCheckbox
											? 'bg-slate-200 hover:bg-slate-100 transition'
											: 'bg-white hover:bg-slate-100 '
									}
								>
									<td className="px-2 md:px-4 py-2 text-slate-800">
										{user.name}
									</td>
									<td className="px-2 md:px-4 py-2 text-slate-800">
										{user.city}
									</td>
									<td className="px-2 md:px-4 py-2 text-slate-800">
										{moment(user.birthday).format(
											'DD.MM.YYYY'
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									className="text-center px-8 py-4 text-slate-800 bg-white"
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
