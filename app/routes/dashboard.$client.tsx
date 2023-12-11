import {
	Link,
	Outlet,
	useFetchers,
	useLoaderData,
	useNavigate,
} from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix";
import {
	differenceInDays,
	endOfMonth,
	endOfWeek,
	format,
	isBefore,
	parseISO,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon, ListTodoIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { CircleProgress } from "~/components/structure/Progress";
import { Avatar, AvatarFallback } from "~/components/ui/ui/avatar";
import { Button } from "~/components/ui/ui/button";
import { Calendar } from "~/components/ui/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/ui/popover";
import { AvatarClient, ShortText } from "~/lib/helpers";
import createServerClient from "~/lib/supabase";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);
	const urlRange = new URL(request.url).searchParams.get("range");

	// let range = request.url.includes("/calendar")
	// 	? {
	// 			from: startOfWeek(startOfMonth(new Date()), {
	// 				weekStartsOn: 0,
	// 			}),
	// 			to: endOfWeek(endOfMonth(new Date()), { weekStartsOn: 0 }),
	// 	  }
	// 	: urlRange
	// 	? {
	// 			from: parseISO(urlRange.split("---")[0]),
	// 			to: parseISO(urlRange.split("---")[1]),
	// 	  }
	// 	: {
	// 			from: startOfWeek(startOfMonth(new Date()), {
	// 				weekStartsOn: 0,
	// 			}),
	// 			to: endOfWeek(endOfMonth(new Date()), { weekStartsOn: 0 }),
	// 	  };
	let range = urlRange
		? {
				from: parseISO(urlRange.split("---")[0]),
				to: parseISO(urlRange.split("---")[1]),
		  }
		: {
				from: startOfWeek(startOfMonth(new Date()), {
					weekStartsOn: 0,
				}),
				to: endOfWeek(endOfMonth(new Date()), { weekStartsOn: 0 }),
		  };

	if (params.client) {
		const { data: client } = await supabase
			.from("clients")
			.select("*")
			.eq("slug", params.client)
			.single();
		if (client) {
			const { data: actions } = await supabase
				.from("actions")
				.select("*")
				.eq("client_id", client?.id)
				.gte("date", format(range.from, "yyyy-MM-dd 0:0:0"))
				.lte("date", format(range.to, "yyyy-MM-dd 23:59:59"))
				.order("date", { ascending: false });

			return json({ client, actions, range, headers });
		}
	} else return redirect("/dashboard");
}

export default function DashboardClient() {
	let { client, actions, range } = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const fetchers = useFetchers();

	const [date, setDate] = useState({
		from: parseISO(range.from) as Date,
		to: parseISO(range.to) as Date,
	});

	const isMonth =
		date?.to && date?.from
			? differenceInDays(date?.to, date?.from) > 7
			: false;

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
		<div className="overflow-hidden debug h-full flex flex-col pb-4 gap-8 px-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row gap-4 pt-4 justify-between items-center">
				<div className="flex gap-4 items-center">
					<div className="relative pl-2">
						<AvatarClient
							client={client}
							size="lg"
							style={{
								viewTransitionName: "avatar-client",
							}}
						/>

						<CircleProgress actions={actions} />
					</div>
					<Link
						to={`/dashboard/${client.slug}`}
						unstable_viewTransition
					>
						<h1 className="text-2xl font-semibold leading-none">
							{client?.title}
						</h1>
					</Link>
				</div>
				<div className="flex gap-4 justify-between w-full sm:w-auto">
					<div className="flex items-center gap-1">
						<Button asChild variant={"ghost"}>
							<Link
								to={`/dashboard/${client.slug}/calendar`}
								className="flex gap-2"
								unstable_viewTransition
							>
								<ListTodoIcon className="w-4" />
								<span className="hidden sm:block">
									Todas as ações
								</span>
							</Link>
						</Button>
						<Button asChild variant={"ghost"}>
							<Link
								to={`/dashboard/${client.slug}/calendar`}
								className="flex gap-2"
								unstable_viewTransition
							>
								<CalendarIcon className="w-4" />
								<span className="hidden sm:block">
									Calendário
								</span>
							</Link>
						</Button>
					</div>
					{true ? (
						<div className="flex gap-1">
							<Button variant="ghost">Mês</Button>
							<Button variant="ghost">Semana</Button>
						</div>
					) : (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={date ? "secondary" : "ghost"}
									className="flex gap-2"
								>
									{date?.from && date?.to ? (
										<>
											{format(
												date.from,
												`d 'de' MMM${
													date.from.getFullYear() !==
													new Date().getFullYear()
														? ",y"
														: ""
												}`
											)}

											{" a "}
											{format(
												date.to,
												`d 'de' MMM${
													date.to.getFullYear() !==
													new Date().getFullYear()
														? ",y"
														: ""
												}`
											)}
										</>
									) : (
										"Selecione um período"
									)}
									<ChevronDownIcon className="w-4" />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								className="bg-content w-auto p-0"
							>
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={new Date()}
									selected={date}
									onSelect={(value) => {
										if (value != undefined) {
											setDate(
												value as {
													from: Date;
													to: Date;
												}
											);
											if (value?.from && value.to) {
												navigate(
													`/dashboard/${
														client.slug
													}?range=${format(
														value?.from,
														"yyyy-MM-dd"
													)}---${format(
														value.to,
														"yyyy-MM-dd"
													)}`
												);
											}
										}
									}}
								/>
							</PopoverContent>
						</Popover>
					)}
				</div>
			</div>
			<Outlet context={{ isMonth, range, actions, client }} />
		</div>
	);
}
