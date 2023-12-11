import { Link, useLoaderData, useMatches, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@vercel/remix";
import { format, formatDistanceToNow, parseISO } from "date-fns";

import { ptBR } from "date-fns/locale";
import {
	CalendarDaysIcon,
	CalendarIcon,
	ListChecksIcon,
	ListTodoIcon,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage } from "~/components/ui/ui/avatar";
import { Button } from "~/components/ui/ui/button";
import { Calendar } from "~/components/ui/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/ui/select";
import { AvatarClient, Icons } from "~/lib/helpers";
import createServerClient from "~/lib/supabase";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const [headers, supabase] = createServerClient(request);
	const { id } = params;

	if (!id) throw new Error("$id não foi definido");

	const { data: action } = await supabase
		.from("actions")
		.select("*")
		.eq("id", id)
		.single();

	return json({ headers, action });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: `${data?.action?.title} / ʀᴜʟeʀ`,
		},
	];
};

export default function ActionPage() {
	const { action: baseAction } = useLoaderData<typeof loader>();
	const [action, setAction] = useState(baseAction as Action);
	const submit = useSubmit();

	const { categories, clients, people, priorities, states, user } =
		useMatches()[1].data as DashboardDataType;

	const client = clients.find(
		(client) => client.id === action.client_id
	) as Client;
	const category = categories.find(
		(category) => category.id === action.category_id
	) as Category;
	const state = states.find((state) => state.id === action.state_id) as State;
	const priority = priorities.find(
		(priority) => priority.id === action.priority_id
	) as Priority;
	const responsibles: Person[] = [];
	action.responsibles?.filter((user_id) =>
		responsibles.push(
			people.find((person) => person.user_id === user_id) as Person
		)
	);
	const date = parseISO(action.date);

	const handleActions = (data: {
		[key: string]: string | number | string[] | null;
	}) => {
		submit(
			{ ...data },
			{
				action: "/handle-actions",
				method: "post",
				navigate: false,
			}
		);
	};

	return (
		<div className="mx-auto max-w-xl w-full  h-full flex flex-col">
			<div className="p-4 text-sm flex justify-between items-center  shrink grow-0">
				<div className="flex items-center gap-2 ">
					<AvatarClient
						client={client}
						style={{
							viewTransitionName: "avatar-client",
						}}
					/>
					<div>
						<Link
							to={`/dashboard/${client.slug}`}
							className="text-gray-500 transition hover:text-gray-300 uppercase font-semibold tracking-wide"
						>
							{client.title}
						</Link>
						<div className="text-gray-500 text-[11px] leading-none tracking-wide">
							{format(
								parseISO(baseAction?.updated_at as string),
								"yyyy-MM-dd HH:mm:ss"
							) ===
							format(
								parseISO(baseAction?.created_at as string),
								"yyyy-MM-dd HH:mm:ss"
							)
								? "Criado "
								: "Atualizado "}
							{formatDistanceToNow(
								parseISO(baseAction?.updated_at as string),
								{
									locale: ptBR,
									addSuffix: true,
								}
							)}
						</div>
					</div>
				</div>
				<div className="flex gap-2 items-center">
					<Button variant="ghost" size={"icon"} asChild>
						<Link to={`/dashboard/${client.slug}/actions`}>
							<ListTodoIcon className="w-4 h-4" />
						</Link>
					</Button>
					<Button variant="ghost" size={"icon"} asChild>
						<Link to={`/dashboard/${client.slug}/calendar`}>
							<CalendarDaysIcon className="w-4 h-4" />
						</Link>
					</Button>
				</div>
			</div>
			<div className="px-4 flex flex-col gap-4 text-gray-400  shrink-0 grow">
				{/* Título */}
				<div
					contentEditable="true"
					dangerouslySetInnerHTML={{
						__html: action?.title as string,
					}}
					onInput={(e) =>
						setAction({
							...action,
							title: e.currentTarget.innerText,
						})
					}
					className="bg-transparent  font-semibold text-5xl tracking-tight outline-none focus:text-gray-100 transition "
				/>
				{/* Descrição */}
				<div className="group flex flex-col  shrink-0 grow">
					<div className="flex  gap-4 mb-2 items-center font-semibold uppercase text-xs tracking-wider">
						<div>Descrição</div>
						<hr className="border-gray-300/20 w-full opacity-0 group-focus-within:opacity-100 " />
					</div>
					<div
						id="description"
						contentEditable="true"
						dangerouslySetInnerHTML={{
							__html: action?.description as string,
						}}
						onInput={(e) =>
							setAction({
								...action,
								title: e.currentTarget.innerText,
							})
						}
						className="bg-transparent font-normal text-xl leading-normal outline-none focus:text-gray-100 transition  grow shrink-0"
					/>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-2">
					{/* Clientes */}
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-auto p-2 focus:ring-2 ring-primary focus:ring-offset-0 outline-none border-none h-auto -ml-2 rounded-xl flex items-center gap-4">
								<AvatarClient client={client} size="lg" />
								{/* <span className="font-semibold">
									{client.title}
								</span> */}
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								{clients.map((client) => (
									<DropdownMenuItem
										key={client.id}
										className="bg-item flex items-center gap-2"
										textValue={client.title}
										onSelect={async () => {
											if (
												client.id !== action.client_id
											) {
												await handleActions({
													id: action.id,
													action: "action-update",
													client_id: Number(
														client.id
													),
												});

												setAction({
													...action,
													client_id: Number(
														client.id
													),
												});
											}
										}}
									>
										<AvatarClient client={client} />
										<span>{client.title}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{/* Categoria */}
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-auto p-2  focus:ring-2 ring-primary focus:ring-offset-0 outline-none border-none h-auto rounded-xl flex items-center gap-2">
								<div className="grid place-content-center h-12 w-12 bg-gray-900 rounded-full">
									<Icons id={category.slug} />
								</div>
								{/* <span className="font-semibold">
									{category.title}
								</span> */}
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								{categories.map((category) => (
									<DropdownMenuItem
										key={category.id}
										className="bg-item flex items-center gap-2"
										textValue={category.title}
										onSelect={() =>
											setAction({
												...action,
												category_id: Number(
													category.id
												),
											})
										}
									>
										<Icons
											id={category.slug}
											className="w-4 h-4 opacity-75"
										/>
										<span>{category.title}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{/* States */}
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-auto p-2 focus:ring-2 ring-primary focus:ring-offset-0 outline-none border-none h-auto -ml-2 rounded-xl flex items-center gap-4">
								<div className="grid place-content-center h-12 w-12 bg-gray-900 rounded-full">
									<div
										className={`rounded-full h-6 w-6 border-4 border-${state.slug}`}
									></div>
								</div>
								{/* <span className="font-semibold">
									{state.title}
								</span> */}
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								{states.map((state) => (
									<DropdownMenuItem
										key={state.id}
										className="bg-item flex items-center gap-2"
										textValue={state.title}
										onSelect={() =>
											setAction({
												...action,
												state_id: Number(state.id),
											})
										}
									>
										<div
											className={`rounded-full h-3 w-3 my-1 border-2 border-${state.slug}`}
										></div>
										<span>{state.title}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{/* Prioridade */}
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-auto p-2 focus:ring-2 ring-primary focus:ring-offset-0 outline-none border-none h-auto -ml-2 rounded-xl flex items-center gap-4">
								<div className="grid place-content-center h-12 w-12 bg-gray-900 rounded-full">
									<Icons id={priority.slug} type="priority" />
								</div>
								{/* <span className="font-semibold">
									{priority.title}
								</span> */}
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								{priorities.map((priority) => (
									<DropdownMenuItem
										key={priority.id}
										className="bg-item flex items-center gap-2"
										textValue={priority.title}
										onSelect={() =>
											setAction({
												...action,
												priority_id: priority.id,
											})
										}
									>
										<Icons
											id={priority.slug}
											type="priority"
											className="w-4 h-4"
										/>
										<span>{priority.title}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{/* Responsáveis */}
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-auto p-2 focus:ring-2 ring-primary focus:ring-offset-0 outline-none border-none h-auto -ml-2 rounded-xl flex items-center gap-4">
								<div className="flex p-2 bg-gray-900 rounded-full pl-3">
									{responsibles.map((person) => (
										<Avatar
											key={person.id}
											className="w-8 h-8 -ml-1 border-l-2 border-background"
										>
											<AvatarImage src={person.image} />
										</Avatar>
									))}
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								{people.map((person) => (
									<DropdownMenuCheckboxItem
										key={person.id}
										className="bg-select-item flex items-center gap-2"
										textValue={person.name}
										checked={action.responsibles.includes(
											person.user_id
										)}
										onCheckedChange={(checked) => {
											if (
												!checked &&
												action.responsibles.length < 2
											) {
												alert(
													"É necessário ter pelo menos um responsável pala ação"
												);
												return false;
											}
											let tempResponsibles = checked
												? [
														...action.responsibles,
														person.user_id,
												  ]
												: action.responsibles.filter(
														(id) =>
															id !==
															person.user_id
												  );

											setAction({
												...action,
												responsibles: tempResponsibles,
											});
										}}
									>
										<Avatar
											key={person.id}
											className="w-4 h-4"
										>
											<AvatarImage src={person.image} />
										</Avatar>
										<span>{person.name}</span>
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="flex justify-between items-center pb-4">
					<div className="font-normal">
						<Popover>
							<PopoverTrigger asChild tabIndex={7}>
								<Button
									variant="ghost"
									size="sm"
									className="font-normal focus-visible:ring-offset-0 flex items-center gap-2 -ml-3"
								>
									<CalendarIcon className="w-4 h-4" />
									<span>
										{format(
											date,
											"d 'de' MMMM 'de' yyyy 'às' H'h'".concat(
												date.getMinutes() > 0 ? "m" : ""
											),
											{
												locale: ptBR,
											}
										)}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="bg-content">
								<Calendar
									mode="single"
									selected={parseISO(action.date)}
									onSelect={(date) => {
										if (date) {
											date?.setHours(
												parseISO(
													action.date
												).getHours(),
												parseISO(
													action.date
												).getMinutes()
											);

											setAction({
												...action,
												date: format(
													date,
													"yyyy-MM-dd'T'HH:mm"
												),
											});
										}
									}}
								/>
								<div className="flex w-40 mx-auto">
									<Select
										value={parseISO(action.date)
											.getHours()
											.toString()}
										onValueChange={(value) => {
											let date = parseISO(action.date);
											date.setHours(Number(value));
											setAction({
												...action,
												date: format(
													date,
													"yyyy-MM-dd'T'HH:mm"
												),
											});
										}}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Array(24)
												.fill(0)
												.map((i, j) => {
													return (
														<SelectItem
															value={j.toString()}
															key={j}
														>
															{j.toString()}
														</SelectItem>
													);
												})}
										</SelectContent>
									</Select>
									<Select
										value={parseISO(action.date)
											.getMinutes()
											.toString()}
										onValueChange={(value) => {
											let date = parseISO(action.date);
											date.setMinutes(Number(value));
											setAction({
												...action,
												date: format(
													date,
													"yyyy-MM-dd'T'HH:mm"
												),
											});
										}}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Array(60)
												.fill(0)
												.map((i, j) => {
													return (
														<SelectItem
															value={j.toString()}
															key={j}
														>
															{j.toString()}
														</SelectItem>
													);
												})}
										</SelectContent>
									</Select>
								</div>
							</PopoverContent>
						</Popover>
					</div>
					<div>
						<Button
							variant="default"
							onClick={(e) => {
								// console.log(e.shiftKey);
								// console.log({ action });

								handleActions({
									...action,
									responsibles: action.responsibles,
									action: "action-update",
								});
							}}
						>
							Atualizar
						</Button>
					</div>
				</div>
			</div>
			{/* <pre className="text-xs leading-relaxed text-gray-600">
				
				{JSON.stringify(action, undefined, 2)}
			</pre> */}
		</div>
	);
}
