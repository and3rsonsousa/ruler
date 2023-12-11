import { Link, useMatches, useOutletContext } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isSameYear,
	isToday,
	parseISO,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import { pt, ptBR } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ListOfActions } from "~/components/structure/Action";
import CreateAction from "~/components/structure/CreateAction";
import { Button } from "~/components/ui/ui/button";

export const meta: MetaFunction = ({ matches }) => {
	const { client } = matches[2].data as DashboardClientType;

	return [
		{
			title: `Calendário / ${
				matches[2].data ? client.title : "Dashboard"
			} / ʀᴜʟeʀ`,
		},
		{ name: "description", content: "Rule your task" },
	];
};

export default function ClientCalendar() {
	const matches = useMatches();
	const { categories, states, priorities } = matches[1]
		.data as DashboardDataType;
	const { actions, client, range, isMonth } =
		useOutletContext() as DashboardClientCalendarType;

	const month = eachDayOfInterval({
		start: new Date(range.from as Date),
		end: new Date(range.to as Date),
	});

	let calendar = month.map((day) => {
		const _actions = actions.filter((action) =>
			isSameDay(parseISO(action.date), day)
		);
		return { date: day, actions: _actions };
	});

	const baseDate = calendar[Math.ceil(calendar.length / 2)].date;

	return (
		<div className="flex flex-col h-full">
			<div className="pb-4 text-xl font-semibold flex items-center gap-2">
				<span className="capitalize">
					{format(
						baseDate,
						"MMMM".concat(
							baseDate.getFullYear() !== new Date().getFullYear()
								? "/yyyy"
								: ""
						),
						{
							locale: ptBR,
						}
					)}
				</span>
				<Button variant="ghost" size="icon" asChild>
					<Link
						to={`/dashboard/${client.slug}/calendar?range=${format(
							startOfWeek(startOfMonth(subMonths(baseDate, 1))),
							"yyyy-MM-dd"
						)}---${format(
							endOfWeek(endOfMonth(subMonths(baseDate, 1))),
							"yyyy-MM-dd"
						)}`}
					>
						<ChevronLeftIcon className="w-6 h-6" />
					</Link>
				</Button>
				<Button variant="ghost" size="icon" asChild>
					<Link
						to={`/dashboard/${client.slug}/calendar?range=${format(
							startOfWeek(startOfMonth(addMonths(baseDate, 1))),
							"yyyy-MM-dd"
						)}---${format(
							endOfWeek(endOfMonth(addMonths(baseDate, 1))),
							"yyyy-MM-dd"
						)}`}
					>
						<ChevronRightIcon className="w-6 h-6" />
					</Link>
				</Button>
			</div>
			<div className="grid-cols-7 hidden md:grid border-b border-t py-2 shrink grow-0">
				{eachDayOfInterval({
					start: startOfWeek(new Date()),
					end: endOfWeek(new Date()),
				}).map((day, i) => (
					<div
						key={i}
						className="uppercase font-bold tracking-wide text-xs text-center"
					>
						{format(day, "eee", { locale: ptBR })}
					</div>
				))}
			</div>
			<div className="scrollbars">
				<div
					className={`grid md:grid-cols-7 ${
						calendar.length > 35 ? "grid-rows-6" : "grid-rows-5"
					} shrink-0 grow min-h-full`}
				>
					{calendar.map((day, i) => (
						<div
							key={i}
							className={`group space-y-2 ${
								day.actions.length > 0 ? "" : "hidden md:block"
							}`}
						>
							<div
								className={`md:text-sm flex justify-between items-center ${
									!isSameMonth(day.date, new Date())
										? "md:opacity-50"
										: ""
								}`}
							>
								<span
									className={`font-semibold text-xs grid place-content-center h-5 w-5 rounded-full ${
										isToday(day.date)
											? " bg-primary text-primary-foreground text-center"
											: ""
									}`}
								>
									{day.date.getDate()}
								</span>
								<span className="md:hidden font-medium">
									{format(
										day.date,
										`, eeee 'de' MMMM${
											!isSameYear(day.date, new Date())
												? " 'de' yyyy"
												: ""
										}`,
										{ locale: ptBR }
									)}
								</span>
								<span className="opacity-0 scale-50 transition group-hover:opacity-100 group-hover:scale-100">
									<CreateAction date={day.date} />
								</span>
							</div>
							<div>
								<ListOfActions
									categories={categories}
									states={states}
									priorities={priorities}
									actions={day.actions}
									hideDate={true}
									showCategory={true}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
