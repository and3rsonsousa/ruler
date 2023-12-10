import {
	NavLink,
	useFetchers,
	useLoaderData,
	useMatches,
} from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@vercel/remix";
import { isBefore, parseISO } from "date-fns";
import {
	BriefcaseIcon,
	ListTodoIcon,
	MoonStarIcon,
	UserCircle2Icon,
} from "lucide-react";
import { useState } from "react";
import { ActionBlock, ActionLine } from "~/components/structure/Action";
import { Avatar, AvatarFallback } from "~/components/ui/ui/avatar";
import { Button } from "~/components/ui/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/ui/dropdown-menu";

import { ScrollArea } from "~/components/ui/ui/scroll-area";
import { Toggle } from "~/components/ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/ui/toggle-group";
import {
	AvatarClient,
	Icons,
	ShortText,
	getLateActions,
	getNotFinishedActions,
	getTodayActions,
	getUrgentActions,
} from "~/lib/helpers";
import createServerClient from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);
	const { data: actions } = await supabase
		.from("actions")
		.select("*")
		.order("title", { ascending: true })
		.order("date", { ascending: false })
		.order("created_at", { ascending: false });
	return json({ headers, actions });
}

export const meta: MetaFunction = () => {
	return [
		{
			title: "Dashboard / ʀᴜʟeʀ",
		},
	];
};

export default function DashboardIndex() {
	let { actions } = useLoaderData<typeof loader>();
	const fetchers = useFetchers();
	const [allActions, setAllActions] = useState(false);
	const [priority, setPriority] = useState<string>();
	const [category, setCategory] = useState<Category>();

	const { categories, people, states, priorities, clients } = useMatches()[1]
		.data as DashboardDataType;

	let optimisticActions = fetchers.reduce<{ [k: string]: any }>((memo, f) => {
		if (f.formData) {
			let data = Object.fromEntries(f.formData);
			if (String(data.action).includes("-update")) {
				let action = {
					...(actions!.find(
						(action) => action.id === data.id
					) as Action),
					...data,
				};

				let index = actions!.findIndex(
					(action) => action.id === data.id
				);
				actions?.splice(index, 1, action);
			} else if (String(data.action).includes("-duplicate")) {
				let action = {
					...(actions!.find(
						(action) => action.id === data.id
					) as Action),
				};
				let duplicatedAction = actions!.find(
					(action) => action.id === data["newId"].toString()
				);

				if (duplicatedAction === undefined) {
					duplicatedAction = {
						...action,
						id: data["newId"].toString(),
						created_at: data["created_at"].toString(),
						updated_at: data["updated_at"].toString(),
					};
					actions?.push(duplicatedAction);
				}
			} else if (String(data.action).includes("-delete")) {
				let index = actions!.findIndex(
					(action) => action.id === data.id
				);
				actions?.splice(index, 1);
			} else if (
				!actions
					?.map((a) => a.id)
					.includes((data as { [k: string]: any }).id)
			) {
				//INSERIR AÇÕES CRIADAS
				memo.push(data);
			}
		}
		return memo;
	}, []);

	if (actions) {
		actions = [...actions, ...(optimisticActions as Action[])];
	} else {
		actions = optimisticActions as Action[];
	}

	actions?.sort((a, b) =>
		isBefore(parseISO(a.date), parseISO(b.date)) ? -1 : 1
	);

	return (
		<ScrollArea className="h-full px-4 sm:px-8">
			<div className="py-8 flex flex-col gap-8">
				{/* Dashboard dada */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
					{[
						{
							id: 1,
							title: "Clientes",
							data: clients.length,
							icon: (
								<BriefcaseIcon className="w-8 text-gray-400" />
							),
						},
						{
							id: 2,
							title: "Usuários",
							data: people.length,
							icon: (
								<UserCircle2Icon className="w-8 text-gray-400" />
							),
						},
						{
							id: 3,
							title: "Ações",
							data: actions?.length,
							icon: (
								<ListTodoIcon className="w-8 text-gray-400" />
							),
						},
						{
							id: 4,
							title: "em Atraso",
							data: getLateActions({ actions })?.length,
							icon: (
								<MoonStarIcon className="w-8 text-gray-400" />
							),
						},
					].map((item) => (
						<div
							className="bg-gray-900 hover:bg-gray-800 transition flex gap-2 justify-between items-center p-4 rounded-xl"
							key={item.id}
						>
							{item.icon}
							<span className="font-semibold tracking-tight text-sm">
								{item.data} {item.title}
							</span>
						</div>
					))}
				</div>
				{/* Urgente */}
				<div className="border-red-500 border-2 p-4 rounded-xl">
					<div className="flex justify-between items-center">
						<h1 className="mb-4 text-2xl font-semibold tracking-tight text-red-500">
							Urgente
						</h1>
					</div>
					<div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
						{getUrgentActions(actions)?.map((action) => (
							<ActionBlock
								key={action.id}
								action={action}
								states={states}
								categories={categories}
								priorities={priorities}
								client={clients.find(
									(client) => action.client_id === client.id
								)}
							/>
						))}
					</div>
				</div>
				{/* Clientes */}

				<div className="flex mx-auto w-72 sm:w-96 md:w-full flex-wrap gap-4 justify-center">
					{clients.map((client) => (
						<NavLink
							to={`/dashboard/${client.slug}`}
							className="hover:ring-4 rounded-full ring-primary transition ring-offset-4 ring-offset-background"
							prefetch="intent"
							unstable_viewTransition
							key={client.id}
						>
							{({ isTransitioning }) => (
								<AvatarClient
									size="lg"
									client={client}
									key={client.id}
									style={
										isTransitioning
											? {
													viewTransitionName:
														"avatar-client",
											  }
											: undefined
									}
								/>
							)}
						</NavLink>
					))}
				</div>

				{/* Ações de hoje */}
				<div>
					<div className="flex justify-between items-center">
						<h1 className="mb-4 text-2xl font-semibold tracking-tight">
							Hoje
						</h1>
						<div>
							<Toggle
								pressed={allActions}
								onPressedChange={(pressed) =>
									setAllActions(pressed)
								}
								size="sm"
							>
								<span className="text-xs">
									{allActions
										? "Ocultar ações finalizadas"
										: "Mostrar ações finalizadas"}
								</span>
							</Toggle>
						</div>
					</div>
					<div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
						{getTodayActions(actions, allActions)?.map((action) => (
							<ActionBlock
								key={action.id}
								action={action}
								states={states}
								categories={categories}
								priorities={priorities}
								client={clients.find(
									(client) => action.client_id === client.id
								)}
							/>
						))}
					</div>
				</div>
				{/* Ações em atraso */}
				<div>
					<div className="flex justify-between items-center">
						<h1 className="mb-4 text-2xl font-semibold tracking-tight">
							Ações em atraso
						</h1>
						<div className="flex gap-4">
							<ToggleGroup
								type="single"
								value={priority}
								onValueChange={(value) => setPriority(value)}
								className="flex gap-2 items-center text-right"
							>
								{[
									{
										value: "low",
										text: "Baixa",
									},
									{
										value: "mid",
										text: "Média",
									},
									{
										value: "high",
										text: "Alta",
									},
								].map((item) => (
									<ToggleGroupItem
										asChild
										value={item.value}
										key={item.value}
									>
										<Button
											size="icon"
											variant={
												priority === item.value
													? "default"
													: "ghost"
											}
											title={item.text}
										>
											<Icons
												id={item.value}
												type="priority"
												className={`w-4 ${
													priority !== item.value
														? "text-gray-300"
														: ""
												}`}
											/>
										</Button>
									</ToggleGroupItem>
								))}
							</ToggleGroup>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										size="sm"
										variant={category ? "default" : "ghost"}
									>
										{category?.title ||
											"Filtro por Categoria"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="bg-content">
									{categories.map((category) => (
										<DropdownMenuItem
											key={category.id}
											className="bg-item flex gap-2 items-center"
											onSelect={() =>
												setCategory(category)
											}
										>
											<Icons
												id={category.slug}
												className="w-3 h-3"
											/>
											{category.title}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
						{getLateActions({
							actions,
							priority: priority
								? (priority as PRIORITIES)
								: undefined,
						})?.map((action) => (
							<ActionLine
								key={action.id}
								action={action}
								states={states}
								categories={categories}
								priorities={priorities}
							/>
						))}
					</div>
				</div>
				{/* Ações a fazer */}
				<div>
					<h1 className="mb-4 text-2xl font-semibold tracking-tight">
						Ações para fazer
					</h1>
					<div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
						{getNotFinishedActions(actions)?.map((action) => (
							<ActionLine
								key={action.id}
								action={action}
								states={states}
								categories={categories}
								priorities={priorities}
							/>
						))}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
