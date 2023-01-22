<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if (localStorage.getItem('marks')) goto('/app');

		customerId = localStorage.getItem('customer_id') || '';
	});

	let customerId = '';
</script>

<svelte:head>
	<title>ReJS - Login</title>
</svelte:head>

<main class="flex justify-center items-center h-screen">
	<form
		action="/app"
		method="post"
		class="flex flex-col gap-4"
		on:submit={() => {
			localStorage.setItem('customer_id', customerId);
		}}
	>
		<input
			type="text"
			name="customer_id"
			placeholder="Customer ID"
			required
			bind:value={customerId}
		/>
		<input type="text" name="username" placeholder="Username" required />
		<input type="password" name="password" placeholder="Password" required />
		<input type="submit" value="Log in" />
	</form>
</main>

<style>
</style>
