import { Link, useLoaderData, useMatches, useNavigate } from "@remix-run/react";
import {
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@vercel/remix";
import {
	endOfMonth,
	endOfWeek,
	format,
	isBefore,
	parseISO,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
	ActionBlock,
	ActionGrid,
	ActionLine,
	BlockOfActions,
	GridOfActions,
	ListOfActions,
} from "~/components/structure/Action";
import { MicroHeader } from "~/components/structure/Headings";
import { CircleProgress } from "~/components/structure/Progress";
import { Avatar, AvatarFallback } from "~/components/ui/ui/avatar";
import { Button } from "~/components/ui/ui/button";
import { Calendar } from "~/components/ui/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/ui/popover";
import { ScrollArea } from "~/components/ui/ui/scroll-area";
import { FINISHED_ID, POST_ID, VIDEO_ID } from "~/lib/constants";
import {
	ShortText,
	getInstagramActions,
	getLateActions,
	getNotFinishedActions,
	getTodayActions,
} from "~/lib/helpers";
import createServerClient from "~/lib/supabase";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);
	const urlRange = new URL(request.url).searchParams.get("range");
	let range = urlRange
		? {
				from: parseISO(urlRange.split("---")[0]),
				to: parseISO(urlRange.split("---")[1]),
		  }
		: {
				from: startOfWeek(startOfMonth(new Date())),
				to: endOfWeek(endOfMonth(new Date())),
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: `${
				data ? data.client.short.toUpperCase() : "Dashboard"
			} / ʀᴜʟeʀ`,
		},
		{ name: "description", content: "Rule your task" },
	];
};

export default function ClientPage() {
	const { client, actions, range } = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	const matches = useMatches();
	const [date, setDate] = useState<DateRange | undefined>({
		from: parseISO(range.from),
		to: parseISO(range.to),
	});

	const { categories, states } = matches[1].data as DashboardDataType;

	return (
		<div className="overflow-hidden flex flex-col pb-4 gap-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row gap-4 pt-4 justify-between items-center">
				<div className="flex gap-4 items-center">
					<div className="relative pl-2">
						<Avatar>
							<AvatarFallback
								style={{
									backgroundColor:
										client.bgColor || "bg-muted",
									color: client.fgColor || "text-gray-300",
								}}
							>
								{ShortText({ text: client.short })}
							</AvatarFallback>
						</Avatar>
						<CircleProgress actions={actions} />
					</div>

					<h1 className="text-2xl font-semibold leading-none">
						{client?.title}
					</h1>
				</div>
				<div className="flex justify-between w-full sm:w-auto">
					<Button asChild variant={"ghost"}>
						<Link
							to={`/dashboard/${client.slug}/calendar`}
							className="flex gap-2"
						>
							<CalendarIcon className="w-4" />
							<span>Calendário</span>
						</Link>
					</Button>
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
									setDate(value);
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
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			<div>
				<MicroHeader>Hoje</MicroHeader>
				<BlockOfActions
					actions={getTodayActions(actions)}
					categories={categories}
					states={states}
				/>
			</div>
			<div className="md:flex overflow-hidden gap-8">
				<div className="h-full flex flex-col gap-4 overflow-hidden md:w-1/2 xl:w-3/5">
					<div className="max-h-[50%] flex flex-col space-y-1 relative">
						<MicroHeader>Atrasados</MicroHeader>
						<ListOfActions
							actions={getLateActions(actions)}
							categories={categories}
							states={states}
						/>
						{/* <div className="absolute w-full h-16 bottom-0 bg-gradient-to-t from-background"></div> */}
					</div>
					<MicroHeader>Próximas Ações</MicroHeader>
					<ListOfActions
						actions={getNotFinishedActions(actions)}
						categories={categories}
						states={states}
					/>
				</div>

				<div className="md:w-1/2 xl:w-2/5 h-full">
					<MicroHeader>Instagram</MicroHeader>
					<GridOfActions
						actions={getInstagramActions(actions)}
						categories={categories}
						states={states}
					/>
				</div>
			</div>
		</div>
	);
}
