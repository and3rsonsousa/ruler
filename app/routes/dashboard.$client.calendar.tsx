import { useMatches, useOutletContext } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";
import {
	eachDayOfInterval,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isSameYear,
	isToday,
	parseISO,
	startOfWeek,
} from "date-fns";
import { pt, ptBR } from "date-fns/locale";
import { ListOfActions } from "~/components/structure/Action";
import CreateAction from "~/components/structure/CreateAction";

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
	const { categories, states } = matches[1].data as DashboardDataType;
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

	return (
		<div className="flex flex-col">
			<div className="grid-cols-7 hidden md:grid border-b border-t py-2">
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
			<div className="grid md:grid-cols-7 gap-1">
				{calendar.map((day, i) => (
					<div
						key={i}
						className={`mb-4 space-y-2 ${
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
								className={`font-bold h-5 w-5 rounded-full ${
									isToday(day.date)
										? " bg-primary text-primary-foreground -ml-1 text-center"
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
							<CreateAction date={day.date} />
						</div>
						<div>
							<ListOfActions
								categories={categories}
								states={states}
								actions={day.actions}
								hideDate={true}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
