import {
	Link,
	useFetcher,
	useFetchers,
	useMatches,
	useNavigation,
	useOutletContext,
} from "@remix-run/react";
import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/ui/avatar";
import { Button } from "../ui/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/ui/dropdown-menu";
import Logo from "./Logo";

export default function Header() {
	const { supabase } = useOutletContext<OutletContextType>();

	const matches = useMatches();
	const navigation = useNavigation();

	const { clients, user } = matches[1].data as DashboardDataType;
	const { client } = matches[1].params;

	const fetchers = useFetchers();

	return (
		<header className="container mx-auto h-16 top-0 px-4 sm:px-8 left-0 right-0 fixed backdrop-blur-2xl bg-background/25 items-center flex-grow flex-shrink-0 flex justify-between z-10">
			<div className="flex items-center gap-2">
				<Link to="/dashboard" unstable_viewTransition>
					<Logo />
				</Link>

				{(navigation.state !== "idle" ||
					fetchers.filter((f) => f.formData).length > 0) && (
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
						<Avatar className="cursor-pointer h-8 w-8">
							<AvatarImage src={user.image} />
							<AvatarFallback>
								{user.name
									.split(" ")[0][0]
									.concat(user.name.split(" ")[1][0])}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-content">
						<DropdownMenuItem
							onSelect={() => supabase.auth.signOut()}
							className="bg-item"
						>
							Sair
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-gray-300/20" />
						<DropdownMenuLabel className="mx-2">
							Clientes
						</DropdownMenuLabel>
						<DropdownMenuItem
							onSelect={() => supabase.auth.signOut()}
							className="bg-item"
						>
							Ver todos os Clientes
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => supabase.auth.signOut()}
							className="bg-item"
						>
							Adicionar novo Cliente
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-gray-300/20" />
						<DropdownMenuLabel className="mx-2">
							Usuários
						</DropdownMenuLabel>
						<DropdownMenuItem
							onSelect={() => supabase.auth.signOut()}
							className="bg-item"
						>
							Ver todos os Usuários
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => supabase.auth.signOut()}
							className="bg-item"
						>
							Adicionar novo Usuário
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r  from-transparent via-gray-700"></div>
		</header>
	);
}
