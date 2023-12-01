import { useMatches } from "@remix-run/react";

export default function ClientCalendar() {
	const matches = useMatches();

	return (
		<div>
			<pre>{JSON.stringify(matches[2].data, undefined, 2)}</pre>
		</div>
	);
}
