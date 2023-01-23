<script lang="ts" context="module">
	export type Subject = {
		marks: { mark: string; weight: number; enabled: boolean }[];
		average: number;
		enabled: boolean;
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Mark } from '$lib/server/scrape';
	import type { ActionData } from './$types';
	import TableRow from './TableRow.svelte';

	export let form: ActionData;
	type MarksMap = Record<string, Subject>;

	let marksMap: MarksMap = {};
	let average = 0;

	function parseForm(formMarks: Mark[]): MarksMap {
		const marksMap: MarksMap = {};

		formMarks.forEach((mark) => {
			let subject = marksMap[mark.subject];
			if (!subject) {
				subject = {
					average: 0,
					marks: [],
					enabled: true
				};
				marksMap[mark.subject] = subject;
			}

			subject.marks.push({
				mark: mark.mark,
				weight: mark.weight,
				enabled: true
			});
		});

		return Object.keys(marksMap)
			.sort()
			.reduce((obj: MarksMap, key) => {
				obj[key] = marksMap[key];
				return obj;
			}, {});
	}

	onMount(async () => {
		if (form) {
			marksMap = parseForm(form.marks);
			average = calculateAverage();
			localStorage.setItem('marks', JSON.stringify(marksMap));
			return;
		}

		const marksJson = localStorage.getItem('marks');
		if (!marksJson) {
			await goto('/');
			return;
		}

		marksMap = JSON.parse(marksJson);
		average = calculateAverage();
	});

	function logout() {
		localStorage.removeItem('marks');
		goto('/');
	}

	function calculateAverage() {
		Object.keys(marksMap).forEach((v) => {
			const marks = marksMap[v];
			let total = 0;
			let totalWeight = 0;
			if (!marks.marks) return 0;
			marks.marks.forEach((v) => {
				if (!v.enabled) return;

				const markN = Number(v.mark);
				if (!markN) return;

				total += markN * v.weight;
				totalWeight += v.weight;
			});

			marks.average = total / totalWeight;
		});

		let total = 0;
		let subjectCount = 0;

		Object.values(marksMap).forEach((v) => {
			if (v.enabled) {
				total += v.average;
				++subjectCount;
			}
		});
		return total / subjectCount;
	}
</script>

<div class="mt-5">
	<button on:click={logout}>Logout</button>

	<main class="main-table">
		<div class="table-element font-bold">Subjects</div>
		<div class="table-element font-bold">Average</div>
		<div class="table-element font-bold">Marks</div>

		{#each Object.keys(marksMap) as subject}
			<TableRow
				name={subject}
				bind:marks={marksMap[subject]}
				on:recalculate={() => {
					localStorage.setItem('marks', JSON.stringify(marksMap));
					average = calculateAverage();
				}}
			/>
		{/each}

		<div class="table-element font-bold">TOTAL</div>
		<div class="table-element font-bold">
			{average.toFixed(2)}
		</div>
		<div class="table-element" />
	</main>
</div>

<style>
	.main-table {
		display: grid;
		grid-template-columns: 3fr 1fr 7fr;
		gap: 1px;
		@apply mt-5 shadow bg-slate-500 rounded overflow-auto border border-slate-500;
	}

	:global(.table-element) {
		@apply bg-slate-200 flex items-center px-3 h-12;
	}

	button {
		@apply rounded shadow py-2 px-3 bg-slate-200;
	}
</style>
