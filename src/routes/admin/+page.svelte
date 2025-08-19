<script lang="ts">
	import type { PageData } from './$types.js';

	export let data: PageData;

	let users = data.users;
	let selectedUser: { id: string; name: string; email: string; role: string } | null = null;
	let showRoleModal = false;
	let newRole = 'user';
	let loading = false;

	// Check authentication and admin status
	$: isAuthenticated = data.authenticated;
	$: isAdmin = data.authenticated && !data.error;
	$: errorMessage = data.error;

	async function updateUserRole(userId: string, newRole: string) {
		loading = true;
		try {
			const response = await fetch(`/api/admin/update-role`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, role: newRole })
			});

			if (response.ok) {
				// Update local state
				users = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user));
				showRoleModal = false;
				selectedUser = null;
			} else {
				const error = await response.json();
				alert(`Error: ${error.error}`);
			}
		} catch (error) {
			console.error('Error updating role:', error);
			alert('Failed to update user role');
		} finally {
			loading = false;
		}
	}

	function openRoleModal(user: { id: string; name: string; email: string; role: string }) {
		selectedUser = user;
		newRole = user.role;
		showRoleModal = true;
	}

	function closeRoleModal() {
		showRoleModal = false;
		selectedUser = null;
	}

	function formatDate(dateString: string | Date) {
		const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getRoleBadgeColor(role: string) {
		return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
	}
</script>

<svelte:head>
	<title>Admin Dashboard - User Management</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
			<p class="mt-2 text-gray-600">Manage users and system access</p>
		</div>

		{#if !isAuthenticated}
			<!-- Not Authenticated -->
			<div class="rounded-lg bg-white p-8 text-center shadow">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
				>
					<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Authentication Required</h3>
				<p class="mb-6 text-gray-600">{errorMessage}</p>
				<a
					href="/login"
					class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
				>
					Go to Login
				</a>
			</div>
		{:else if !isAdmin}
			<!-- Not Admin -->
			<div class="rounded-lg bg-white p-8 text-center shadow">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100"
				>
					<svg
						class="h-6 w-6 text-yellow-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Admin Access Required</h3>
				<p class="mb-6 text-gray-600">{errorMessage}</p>
				<a
					href="/"
					class="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
				>
					Go Home
				</a>
			</div>
		{:else}
			<!-- Admin Dashboard Content -->
			<!-- Stats Cards -->
			<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
									/>
								</svg>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Total Users</dt>
									<dd class="text-lg font-medium text-gray-900">{users.length}</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-red-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Admins</dt>
									<dd class="text-lg font-medium text-gray-900">
										{users.filter((u) => u.role === 'admin').length}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-green-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Verified Users</dt>
									<dd class="text-lg font-medium text-gray-900">
										{users.filter((u) => u.emailVerified).length}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="overflow-hidden rounded-lg bg-white shadow">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<svg
									class="h-6 w-6 text-blue-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-gray-500">Password Users</dt>
									<dd class="text-lg font-medium text-gray-900">
										{users.filter((u) => u.hasPassword).length}
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Users Table -->
			<div class="overflow-hidden bg-white shadow sm:rounded-md">
				<div class="px-4 py-5 sm:px-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">User Management</h3>
					<p class="mt-1 max-w-2xl text-sm text-gray-500">
						Manage user roles and view account information
					</p>
				</div>
				<div class="border-t border-gray-200">
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>User</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Role</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Status</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Providers</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Joined</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Actions</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each users as user (user.id)}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<div class="h-10 w-10 flex-shrink-0">
													<div
														class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300"
													>
														<span class="text-sm font-medium text-gray-700"
															>{user.name.charAt(0).toUpperCase()}</span
														>
													</div>
												</div>
												<div class="ml-4">
													<div class="text-sm font-medium text-gray-900">{user.name}</div>
													<div class="text-sm text-gray-500">{user.email}</div>
												</div>
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span
												class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getRoleBadgeColor(
													user.role
												)}"
											>
												{user.role}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											{#if user.emailVerified}
												<span
													class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
												>
													Verified
												</span>
											{:else}
												<span
													class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
												>
													Unverified
												</span>
											{/if}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											<div class="flex space-x-1">
												{#each user.providers as provider (provider)}
													<span
														class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {provider ===
														'credentials'
															? 'bg-gray-100 text-gray-800'
															: provider === 'google'
																? 'bg-blue-100 text-blue-800'
																: provider === 'github'
																	? 'bg-gray-900 text-white'
																	: 'bg-gray-100 text-gray-800'}"
													>
														{provider}
													</span>
												{/each}
											</div>
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{formatDate(user.createdAt)}
										</td>
										<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
											{#if user.role !== 'admin'}
												<button
													onclick={() => openRoleModal(user)}
													class="rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-900"
												>
													Make Admin
												</button>
											{:else}
												<button
													onclick={() => openRoleModal(user)}
													class="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-900"
												>
													Remove Admin
												</button>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Role Update Modal -->
{#if showRoleModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600">
		<div class="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
			<div class="mt-3 text-center">
				<h3 class="mb-4 text-lg font-medium text-gray-900">Update User Role</h3>
				<p class="mb-4 text-sm text-gray-500">
					Change role for <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
				</p>

				<div class="mb-4">
					<label for="role-select" class="mb-2 block text-sm font-medium text-gray-700"
						>Select Role</label
					>
					<select
						id="role-select"
						bind:value={newRole}
						class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
					>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<div class="flex justify-end space-x-3">
					<button
						onclick={closeRoleModal}
						class="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						onclick={() => updateUserRole(selectedUser.id, newRole)}
						disabled={loading || newRole === selectedUser.role}
						class="rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? 'Updating...' : 'Update Role'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
