import { ScrollArea } from "@radix-ui/react-scroll-area";
import { format, isSameYear, parseISO } from "date-fns";
import { FINISHED_ID } from "~/lib/constants";

export function ActionLine({
	action,
	categories,
	states,
}: {
	action: Action;
	categories: Category[];
	states: State[];
}) {
	return (
		<div
			className={`py-1 px-4 text-sm border-l-4 rounded bg-gray-900 flex gap-2 justify-between items-center border-${
				states.find((state) => state.id === action.state_id)?.slug
			}`}
		>
			{/* <div
		 	className={`py-1 px-4 text-sm rounded bg-gray-900 flex gap-2 justify-between items-center bg-${
		 		states.find((state) => state.id === action.state_id)?.slug
		 	}`}
		 > */}
			<div className="line-clamp-1">{action.title}</div>
			<div className="text-gray-400 text-xs tabular-nums text-right whitespace-nowrap">
				{format(
					parseISO(action.date),
					`d 'de' MMMM${
						!isSameYear(
							parseISO(action.date).getFullYear(),
							new Date().getUTCFullYear()
						)
							? " 'de' y"
							: ""
					}`
				)}
			</div>
		</div>
	);
}

export function ActionBlock({
	action,
	categories,
	states,
}: {
	action: Action;
	categories: Category[];
	states: State[];
}) {
	return (
		<div
			className={`py-2 px-4 text-sm border-l-4 rounded bg-gray-900 hover:bg-gray-800 flex flex-col justify-between gap-2 border-${
				states.find((state) => state.id === action.state_id)?.slug
			}`}
		>
			<div className="line-clamp-2 leading-tight text-lg font-medium">
				{action.title}
			</div>
			<div className="flex text-gray-400 items-center justify-between">
				<div className="text-[10px] font-bold tracking-widest uppercase">
					{
						categories.find(
							(category) => category.id === action.category_id
						)?.title
					}
				</div>
				<div className=" text-xs tabular-nums text-right whitespace-nowrap">
					{format(
						parseISO(action.date),
						`d 'de' MMM${
							!isSameYear(
								parseISO(action.date).getFullYear(),
								new Date().getUTCFullYear()
							)
								? " 'de' y"
								: ""
						} '-' H'h'm`
					)}
				</div>
			</div>
		</div>
	);
}

export function ActionGrid({
	action,
	states,
	categories,
}: {
	action: Action;
	states: State[];
	categories: Category[];
}) {
	return (
		<div
			className={`flex select-none p-4 flex-col rounded-xl justify-between items-center aspect-square ${
				action.state_id === FINISHED_ID
					? "bg-gray-900 text-gray-500"
					: "bg-gray-800"
			}`}
		>
			<div></div>
			<div
				className={`font-medium line-clamp-3 text-center  ${
					action.title.length > 30
						? "text-sm leading-tight"
						: action.title.length > 18
						? "text-lg tracking-tight leading-[1.15]"
						: "text-2xl tracking-tight leading-none"
				}`}
			>
				{action.title}
			</div>
			<div className="flex leading-none justify-center items-center gap-2">
				<div
					className={`w-2 h-2 rounded-full bg-${
						states.find((state) => state.id === action.state_id)
							?.slug
					}`}
				></div>

				<div className="text-[10px] text-gray-400">
					{format(parseISO(action.date), "E, d 'de' MMM")}
				</div>
			</div>
		</div>
	);
}

export function ListOfActions({
	actions,
	categories,
	states,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
}) {
	return (
		<ScrollArea className="h-auto flex-1 overflow-x-hidden">
			<div className="h-full flex flex-col gap-1">
				{actions?.map((action) => (
					<ActionLine
						action={action}
						categories={categories}
						states={states}
						key={action.id}
					/>
				))}
			</div>
		</ScrollArea>
	);
}

export function BlockOfActions({
	actions,
	categories,
	states,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
}) {
	return (
		<ScrollArea className="h-auto flex-1 overflow-x-hidden">
			<div className="h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
				{actions?.map((action) => (
					<ActionBlock
						action={action}
						categories={categories}
						states={states}
						key={action.id}
					/>
				))}
			</div>
		</ScrollArea>
	);
}

export function GridOfActions({
	actions,
	categories,
	states,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
}) {
	return (
		<ScrollArea className="h-full flex-1 overflow-x-hidden">
			<div className="h-full grid grid-cols-3 gap-2">
				{actions?.map((action) => (
					<ActionGrid
						action={action}
						categories={categories}
						states={states}
						key={action.id}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
