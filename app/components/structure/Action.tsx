import { format, isSameYear, parseISO } from "date-fns";
import { CopyIcon, PencilLineIcon, TimerIcon, TrashIcon } from "lucide-react";
import { FINISHED_ID } from "~/lib/constants";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "../ui/ui/context-menu";
import { useFetcher, useSubmit } from "@remix-run/react";

export function ActionLine({
	action,
	categories,
	states,
	hasShortDate,
	hideDate,
}: {
	action: Action;
	categories: Category[];
	states: State[];
	hasShortDate?: boolean;
	hideDate?: boolean;
}) {
	return (
		<div
			className={`py-1 px-4 text-sm border-l-4 rounded transition select-none bg-gray-900 hover:bg-gray-800 flex gap-2 justify-between items-center border-${
				states.find((state) => state.id === action.state_id)?.slug
			}`}
		>
			<div className="line-clamp-1">{action.title}</div>
			{!hideDate && (
				<div className="text-gray-400 text-xs tabular-nums text-right whitespace-nowrap">
					{hasShortDate
						? format(
								parseISO(action.date),
								`d/M${
									!isSameYear(
										parseISO(action.date).getFullYear(),
										new Date().getUTCFullYear()
									)
										? "/yy"
										: ""
								}`
						  )
						: format(
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
			)}
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
	const fetcher = useFetcher();
	const submit = useSubmit();

	const handleActions = (data: { [key: string]: string | number }) => {
		submit(
			{ ...data, action: "action-update" },
			{
				action: "/handle-actions",
				method: "post",
				navigate: false,
			}
		);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className={`py-2 px-4 text-sm border-l-4 rounded bg-gray-900 hover:bg-gray-800 flex flex-col justify-between gap-2 border-${
						states.find(
							(state) => state.id === Number(action.state_id)
						)?.slug
					}`}
				>
					<div className="line-clamp-1 leading-tight text-lg font-medium">
						{action.title}
					</div>
					<div className="flex text-gray-400 items-center justify-between">
						<div className="text-[10px] font-bold tracking-widest uppercase">
							{
								categories.find(
									(category) =>
										category.id === action.category_id
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
			</ContextMenuTrigger>
			<ContextMenuContent className="bg-content">
				<ContextMenuItem className="bg-item focus:bg-primary flex gap-2 items-center">
					<PencilLineIcon className="w-3 h-3" />
					<span>Editar</span>
				</ContextMenuItem>
				<ContextMenuItem className="bg-item focus:bg-primary flex gap-2 items-center">
					<CopyIcon className="w-3 h-3" />
					<span>Duplicar</span>
				</ContextMenuItem>
				{/* Adiar */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="bg-item focus:bg-primary flex gap-2 items-center">
						<TimerIcon className="w-3 h-3" />
						<span>Adiar</span>
					</ContextMenuSubTrigger>
					<ContextMenuPortal>
						<ContextMenuSubContent className="bg-content">
							{[
								{ time: 1, text: "1 hora" },
								{ time: 3, text: "3 horas" },
								{ time: 8, text: "8 horas" },
								{ time: 24, text: "1 dia" },
								{ time: 3 * 24, text: "3 dias" },
								{ time: 7 * 24, text: "1 semana" },
								{ time: 30 * 24, text: "30 dias" },
							].map((period) => (
								<ContextMenuItem
									key={period.time}
									className="bg-item focus:bg-primary flex gap-2 items-center"
								>
									{period.text}
								</ContextMenuItem>
							))}
						</ContextMenuSubContent>
					</ContextMenuPortal>
				</ContextMenuSub>
				{/* Deletar */}
				<ContextMenuItem className="bg-item focus:bg-primary flex gap-2 items-center">
					<TrashIcon className="w-3 h-3" />
					<span>Deletar</span>
				</ContextMenuItem>
				<ContextMenuSeparator className="bg-gray-300/25 " />
				{/* Categoria */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="bg-item focus:bg-primary flex gap-2 items-center">
						<TimerIcon className="w-3 h-3" />
						<span>
							{
								categories.find(
									(category) =>
										category.id === action.category_id
								)?.title
							}
						</span>
					</ContextMenuSubTrigger>
					<ContextMenuPortal>
						<ContextMenuSubContent className="bg-content">
							{categories.map((category) => (
								<ContextMenuItem
									key={category.id}
									className="bg-item focus:bg-primary flex gap-2 items-center"
								>
									{category.title}
								</ContextMenuItem>
							))}
						</ContextMenuSubContent>
					</ContextMenuPortal>
				</ContextMenuSub>
				{/* States */}
				<ContextMenuSub>
					<ContextMenuSubTrigger className="bg-item focus:bg-primary flex gap-2 items-center">
						<div
							className={`w-2 h-2 rounded-full border-2 border-${
								states.find(
									(state) => state.id === action.state_id
								)?.slug
							}`}
						></div>
						<span>
							{
								states.find(
									(state) => state.id === action.state_id
								)?.title
							}
						</span>
					</ContextMenuSubTrigger>
					<ContextMenuPortal>
						<ContextMenuSubContent className="bg-content">
							{states.map((state) => (
								<ContextMenuItem
									key={state.id}
									className="bg-item focus:bg-primary flex gap-2 items-center"
									onSelect={() => {
										handleActions({
											id: action.id,
											state_id: state.id,
										});
									}}
								>
									<div
										className={`w-2 h-2 rounded-full border-2 border-${state?.slug}`}
									></div>
									<span>{state.title}</span>
								</ContextMenuItem>
							))}
						</ContextMenuSubContent>
					</ContextMenuPortal>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
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
		<div className="scrollbars">
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
		</div>
	);
}

export function BlockOfActions({
	actions,
	categories,
	states,
	max,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
	max?: 1 | 2;
}) {
	return (
		<div className="scrollbars">
			<div
				className={`h-full grid grid-cols-2 ${
					!max
						? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
						: max === 2
						? "grid-cols-2"
						: ""
				} gap-2`}
			>
				{actions?.map((action) => (
					<ActionBlock
						action={action}
						categories={categories}
						states={states}
						key={action.id}
					/>
				))}
			</div>
		</div>
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
		<div className="scrollbars">
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
		</div>
	);
}
