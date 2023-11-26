import type { MetaFunction } from "@remix-run/node";
import { Button } from "react-aria-components";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div>
			<Button isDisabled>Button</Button>
		</div>
	);
}
