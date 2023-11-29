import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Logo from "~/components/structure/Logo";
import { Button } from "~/components/ui/ui/button";

export const meta: MetaFunction = () => {
	return [
		{ title: "ʀᴜʟeʀ" },
		{ name: "description", content: "Rule your task" },
	];
};

export default function Index() {
	return (
		<div className="h-[100dvh] grid place-content-center">
			<div className="text-center">
				<Logo size="lg" />
				<div className="mb-12 leading-tight">
					Rule your task. <br /> Save your time.
				</div>
				<Button asChild variant={"default"}>
					<Link to="/dashboard">Entrar</Link>
				</Button>
			</div>
		</div>
	);
}
