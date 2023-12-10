import { ReactNode } from "react";
import Header from "./Header";
import CreateAction from "./CreateAction";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div
			className="container p-0 relative
		 mx-auto text-gray-300 font-light md:overflow-hidden md:h-[100dvh] flex flex-col antialiased pt-16"
		>
			<Header />
			<div className="md:overflow-hidden flex h-full flex-col">
				{children}
			</div>
			<CreateAction />
		</div>
	);
}
