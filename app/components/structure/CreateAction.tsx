import { PopoverTrigger } from "@radix-ui/react-popover";
import { Form, useMatches, useParams, useSubmit } from "@remix-run/react";
import { addHours, format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/ui/button";
import { Popover, PopoverContent } from "../ui/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/ui/avatar";
import { AvatarClient, Icons, ShortText } from "~/lib/helpers";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/ui/dropdown-menu";
import { Calendar } from "../ui/ui/calendar";
import { ptBR } from "date-fns/locale";
import { useToast } from "../ui/ui/use-toast";

export default function CreateAction({ date }: { date?: Date }) {
	const { categories, states, clients, people, session } = useMatches()[1]
		.data as DashboardDataType;
	let client = (useMatches()[2].data as DashboardClientType).client;
	const [open, setOpen] = useState(false);
	const submit = useSubmit();
	const { toast } = useToast();

	let newDate = date || new Date();
	newDate.setHours(11, 0);

	const cleanAction = {
		category_id: 1,
		client_id: client ? client.id : undefined,
		date: newDate,
		description: "",
		responsibles: [session.user.id],
		state_id: 1,
		title: "",
		user_id: session.user.id,
	};

	const [action, setAction] = useState<RawAction>(cleanAction);

	const category = categories.find(
		(category) => category.id === action.category_id
	) as Category;
	const state = states.find((state) => state.id === action.state_id) as State;
	const responsibles: Person[] = [];
	action.responsibles.filter((user_id) =>
		responsibles.push(
			people.find((person) => person.user_id === user_id) as Person
		)
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{date ? (
					<Button
						variant="ghost"
						size="sm"
						className="h-5 w-5 grid place-content-center p-0"
					>
						<PlusIcon className="w-3 h-3" />
					</Button>
				) : (
					<Button
						variant="default"
						size="icon"
						className="fixed bottom-2 right-2 rounded-full"
					>
						<PlusIcon className="w-8" />
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="bg-content md:px-6 w-[90dvw] mr-[5dvw] sm:max-w-md">
				{/* <pre className="text-xs">
					{JSON.stringify(client, undefined, 2)}
				</pre> */}

				{/* Título */}
				<div
					tabIndex={1}
					className="bg-transparent w-full placeholder:text-gray-500 mb-1 font-medium text-2xl outline-none"
					onBlur={(e) =>
						setAction({
							...action,
							title: e.currentTarget.innerText,
						})
					}
					placeholder="Título"
					contentEditable="true"
					// suppressContentEditableWarning={true}
					dangerouslySetInnerHTML={{ __html: action.title }}
				></div>
				{/* Descrição */}
				<div
					tabIndex={2}
					contentEditable="true"
					className="bg-transparent relative w-full font-light text-sm  outline-none py-2"
					onBlur={(e) =>
						setAction({
							...action,
							description: e.currentTarget.innerText,
						})
					}
					placeholder="Descrição da ação"
					dangerouslySetInnerHTML={{ __html: action.description }}
				></div>
				<hr className="border-gray-300/20 mt-2 mb-4 -mx-4 md:-mx-6" />
				<div className="flex justify-center flex-wrap md:flex-nowrap md:justify-between gap-2">
					<div className="flex items-center justify-between gap-1 w-full">
						{/* Clientes */}
						{/* {JSON.stringify(client)} */}
						<Select
							value={action.client_id?.toString()}
							onValueChange={(value) => {
								setAction({
									...action,
									client_id: Number(value),
								});
							}}
						>
							<SelectTrigger
								tabIndex={3}
								className={`bg-transparent border-none focus:ring-offset-0 ${
									action.client_id
										? "p-1 pl-2 -ml-1"
										: "px-2 py-1"
								}`}
							>
								{action.client_id ? (
									<AvatarClient
										client={
											clients.find(
												(client) =>
													client.id ===
													action.client_id
											) as Client
										}
									/>
								) : (
									"Cliente"
								)}
							</SelectTrigger>
							<SelectContent className="bg-content">
								{clients.map((client) => (
									<SelectItem
										key={client.id}
										value={client.id.toString()}
										className="bg-select-item"
									>
										{client.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Categoria */}
						<Select
							value={action.category_id.toString()}
							onValueChange={(value) =>
								setAction({
									...action,
									category_id: Number(value),
								})
							}
						>
							<SelectTrigger
								tabIndex={4}
								className={`bg-transparent border-none focus:ring-offset-0`}
							>
								<Icons id={category.slug} className="w-4" />
							</SelectTrigger>
							<SelectContent className="bg-content">
								{categories.map((category) => (
									<SelectItem
										value={category.id.toString()}
										key={category.id}
										className="bg-select-item"
									>
										<div className="flex gap-2 items-center">
											<Icons
												id={category.slug}
												className="w-4"
											/>
											<span>{category.title}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* States */}
						<Select
							value={action.state_id.toString()}
							onValueChange={(value) =>
								setAction({
									...action,
									state_id: Number(value),
								})
							}
						>
							<SelectTrigger
								tabIndex={5}
								className={`bg-transparent border-none focus:ring-offset-0`}
							>
								<div
									className={`rounded-full w-4 h-4 border-4 border-${state.slug}`}
								></div>
							</SelectTrigger>
							<SelectContent className="bg-content">
								{states.map((state) => (
									<SelectItem
										value={state.id.toString()}
										key={state.id}
									>
										<div className="flex gap-2 items-center">
											<div
												className={`rounded-full w-2 h-2 border-2 border-${state.slug}`}
											></div>
											<div>{state.title}</div>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Responsáveis */}
						<DropdownMenu>
							<DropdownMenuTrigger
								asChild
								tabIndex={6}
								className="focus:ring-primary border-none outline-none focus:ring-offset-0 focus:ring-2 p-2 rounded-lg"
							>
								<div className="flex pl-2">
									{responsibles.map((person) => (
										<Avatar
											key={person.id}
											className="w-6 h-6 -ml-1 border-l-2 border-background"
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
										className="bg-select-item"
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
										<div className="flex gap-2">
											<Avatar
												key={person.id}
												className="w-4 h-4"
											>
												<AvatarImage
													src={person.image}
												/>
											</Avatar>
											<div className="text-xs">
												{person.name}
											</div>
										</div>
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex justify-between w-full items-center gap-2">
						{/* Data e Hora */}
						<Popover>
							<PopoverTrigger asChild tabIndex={7}>
								<Button
									variant="ghost"
									size="sm"
									className="font-normal text-xs focus-visible:ring-offset-0"
								>
									{format(
										action.date,
										"d/M"
											.concat(
												action.date.getFullYear() !==
													new Date().getFullYear()
													? " 'de' y"
													: ""
											)
											.concat(" 'às' H'h'")
											.concat(
												action.date.getMinutes() !== 0
													? "m"
													: ""
											),
										{ locale: ptBR }
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="bg-content">
								<Calendar
									mode="single"
									selected={action.date}
									onSelect={(date) => {
										if (date) {
											date?.setHours(
												action.date.getHours(),
												action.date.getMinutes()
											);
											setAction({ ...action, date });
										}
									}}
								/>
								<div className="flex w-40 mx-auto">
									<Select
										value={action.date
											.getHours()
											.toString()}
										onValueChange={(value) => {
											let date = action.date;
											date.setHours(Number(value));
											setAction({
												...action,
												date: date,
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
										value={action.date
											.getMinutes()
											.toString()}
										onValueChange={(value) => {
											let date = action.date;
											date.setMinutes(Number(value));
											setAction({
												...action,
												date: date,
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
						<Button
							tabIndex={8}
							variant={"default"}
							onClick={() => {
								if (action.title.length === 0) {
									toast({
										variant: "destructive",
										description:
											"O título não pode ser em vazio.",
									});
									return false;
								}
								if (!action.client_id) {
									toast({
										variant: "destructive",
										description:
											"Selecione o cliente dessa ação.",
									});
								} else {
									submit(
										{
											id: window.crypto.randomUUID(),
											action: "action-create",
											...action,
											date: format(
												action.date,
												"y-MM-dd HH:mm:ss",
												{ locale: ptBR }
											),
										},
										{
											action: "/handle-actions",
											navigate: false,
											method: "POST",
										}
									);
									setAction(cleanAction);
									setOpen(false);
								}
							}}
						>
							Criar
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
