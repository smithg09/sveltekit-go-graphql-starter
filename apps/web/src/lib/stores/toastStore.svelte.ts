interface Toast {
	id: number;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration: number;
}

class ToastStore {
	toasts = $state<Toast[]>([]);
	private nextId = 0;

	show(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
		const id = this.nextId++;
		const toast: Toast = { id, message, type, duration };

		this.toasts = [...this.toasts, toast];

		if (duration > 0) {
			setTimeout(() => {
				this.remove(id);
			}, duration);
		}
	}

	success(message: string, duration?: number) {
		this.show(message, 'success', duration);
	}

	error(message: string, duration?: number) {
		this.show(message, 'error', duration);
	}

	warning(message: string, duration?: number) {
		this.show(message, 'warning', duration);
	}

	info(message: string, duration?: number) {
		this.show(message, 'info', duration);
	}

	remove(id: number) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}
}

export const toastStore = new ToastStore();
export type { Toast };
