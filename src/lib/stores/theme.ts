import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = (): Theme => {
	if (browser) {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || stored === 'light') {
			return stored;
		}
		// Check system preference
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}
	}
	return 'light';
};

// Create the store
const createThemeStore = () => {
	const { subscribe, set, update } = writable<Theme>(getInitialTheme());

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const newTheme = current === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', newTheme);
					document.documentElement.classList.toggle('dark', newTheme === 'dark');
				}
				return newTheme;
			});
		},
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.classList.toggle('dark', theme === 'dark');
			}
			set(theme);
		}
	};
};

export const theme = createThemeStore();

// Initialize theme on page load
if (browser) {
	theme.subscribe((current) => {
		document.documentElement.classList.toggle('dark', current === 'dark');
	});
}
