import { ReactNode } from "react";

export function MicroHeader({ children }: { children: ReactNode }) {
	return (
		<h2 className="uppercase text-sm mb-2 font-bold tracking-wider">
			{children}
		</h2>
	);
}
