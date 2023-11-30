import {
	Link,
	useMatches,
	useNavigation,
	useOutletContext,
} from "@remix-run/react";
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/ui/avatar";
import { Button } from "../ui/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/ui/dropdown-menu";
import Logo from "./Logo";

export default function Header() {
	const { supabase } = useOutletContext<OutletContextType>();

	const matches = useMatches();
	const navigation = useNavigation();

	const { clients } = matches[1].data as DashboardDataType;
	const { client } = matches[1].params;

	return (
		<header className="h-16 top-0 px-4 sm:px-8 left-0 right-0 fixed backdrop-blur-2xl bg-background/25 items-center flex-grow flex-shrink-0 flex justify-between z-10">
			<div className="flex items-center gap-2">
				<Link to="/dashboard" unstable_viewTransition>
					<Logo />
				</Link>

				{navigation.state !== "idle" && (
					<div className="w-6 h-6 border-4 border-primary border-b-primary/50 animate-spin rounded-full"></div>
				)}
			</div>
			<div className="flex items-center justify-end gap-2 text-sm font-medium">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							className="font-semibold text-xs flex items-center gap-2"
						>
							<div>
								{client
									? clients.find((c) => c.slug === client)
											?.title
									: "Clientes"}
							</div>
							<div>
								<ChevronDownIcon className="w-4" />
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-content">
						{clients.map((client) => (
							<DropdownMenuItem key={client.id} asChild>
								<Link
									to={`/dashboard/${client.slug}`}
									className="bg-item focus:bg-primary"
								>
									{client.title}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Avatar>
								<AvatarFallback>AS</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onSelect={() => supabase.auth.signOut()}
						>
							Sair
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r  from-transparent via-primary/50"></div>
		</header>
	);
}
