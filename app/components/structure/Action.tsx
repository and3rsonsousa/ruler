import { useNavigate, useSubmit } from "@remix-run/react";
import {
	addHours,
	format,
	formatDistanceToNow,
	isSameYear,
	parseISO,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CopyIcon, PencilLineIcon, TimerIcon, TrashIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { FINISHED_ID, PRIORITY_HIGH } from "~/lib/constants";
import { Icons, ShortText } from "~/lib/helpers";
import { Avatar, AvatarFallback } from "../ui/ui/avatar";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "../ui/ui/context-menu";

export function ActionLine({
	action,
	categories,
	states,
	priorities,
	hasShortDate,
	hideDate,
	showCategory,
}: {
	action: Action;
	categories: Category[];
	states: State[];
	priorities: Priority[];
	hasShortDate?: boolean;
	hideDate?: boolean;
	showCategory?: boolean;
}) {
	const [edit, setEdit] = useState(false);
	const [isHover, setHover] = useState(false);
	const submit = useSubmit();

	const handleActions = (data: { [key: string]: string | number }) => {
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
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					title={action.title}
					className={`py-1 px-2 w-full @[180px]:px-4 text-xs font-medium border-l-4 rounded transition select-none bg-gray-900 flex gap-2 justify-between items-center ${
						edit
							? "bg-gray-700"
							: "hover:bg-gray-800 hover:text-gray-200"
					} border-${
						states.find(
							(state) => state.id === Number(action.state_id)
						)?.slug
					}`}
					onClick={() => setEdit(true)}
					onMouseEnter={() => {
						setHover(true);
					}}
					onMouseLeave={() => {
						setHover(false);
					}}
				>
					{isHover ? (
						<ShortcutActions
							action={action}
							handleActions={handleActions}
						/>
					) : null}
					<div className="flex items-center gap-2">
						{showCategory && (
							<Icons
								id={
									categories.find(
										(category) =>
											category.id === action.category_id
									)?.slug
								}
								className="w-3 h-3 opacity-50"
							/>
						)}
						<div className="line-clamp-1 text-gray-300">
							{edit ? (
								<input
									type="text"
									defaultValue={action.title}
									className="bg-transparent outline-none"
									onBlur={(e) => {
										setEdit(() => false);
										handleActions({
											action: "action-update",
											id: action.id,
											title: e.target.value,
										});
									}}
								/>
							) : (
								action.title
							)}
						</div>
					</div>

					{!hideDate && (
						<div className="text-gray-500 text-xs tabular-nums text-right whitespace-nowrap">
							{formatActionDatetime({
								date: action.date,
								isDistance: true,
							})}
						</div>
					)}
				</div>
			</ContextMenuTrigger>
			<ContextMenuItems
				action={action}
				categories={categories}
				handleActions={handleActions}
				states={states}
				priorities={priorities}
			/>
		</ContextMenu>
	);
}

export function ActionBlock({
	action,
	categories,
	priorities,
	states,
	client,
}: {
	action: Action;
	categories: Category[];
	priorities: Priority[];
	states: State[];
	client?: Client;
}) {
	const submit = useSubmit();
	const [isHover, setHover] = useState(false);

	const handleActions = (data: { [key: string]: string | number }) => {
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
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className={`bg-gray-900 hover:bg-gray-800 py-2 px-4 text-sm border-l-4 rounded flex flex-col justify-between gap-2 transition border-${
						states.find(
							(state) => state.id === Number(action.state_id)
						)?.slug
					}`}
					onMouseEnter={(e) => {
						setHover(true);
					}}
					onMouseLeave={(e) => {
						setHover(false);
					}}
				>
					{isHover ? (
						<ShortcutActions
							handleActions={handleActions}
							action={action}
						/>
					) : null}
					{/* Title */}
					<div className="line-clamp-1 leading-tight text-lg font-medium">
						{action.title}
					</div>
					<div className="flex text-gray-400 items-center justify-between">
						<div className="flex gap-2 items-center">
							{/* Cliente */}
							{client ? (
								<Avatar className="w-5 h-5">
									<AvatarFallback
										style={{
											backgroundColor:
												client.bgColor || "#999",
											color: client.fgColor || "#333",
										}}
									>
										<ShortText
											text={client.short}
											className="scale-[0.6]"
										/>
									</AvatarFallback>
								</Avatar>
							) : null}
							<div>
								<Icons
									id={
										categories.find(
											(category) =>
												category.id ===
												Number(action.category_id)
										)?.slug
									}
									className="w-4"
								/>
							</div>
							{action.priority_id === PRIORITY_HIGH ? (
								<div>
									<Icons
										id={"high"}
										className="w-4"
										type="priority"
									/>
								</div>
							) : null}
						</div>
						<div className="text-xs tabular-nums text-right whitespace-nowrap">
							{formatActionDatetime({
								date: action.date,
								hasShortDate: false,
								hasTime: true,
							})}
						</div>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuItems
				action={action}
				categories={categories}
				handleActions={handleActions}
				states={states}
				priorities={priorities}
			/>
		</ContextMenu>
	);
}

export function ActionGrid({
	action,
	states,
	categories,
	priorities,
}: {
	action: Action;
	states: State[];
	categories: Category[];
	priorities: Priority[];
}) {
	const [isHover, setHover] = useState(false);
	const submit = useSubmit();

	const handleActions = (data: { [key: string]: string | number }) => {
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
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className={`flex select-none p-4 flex-col rounded-xl justify-between items-center aspect-square ${
						action.state_id === FINISHED_ID
							? "bg-gray-900 text-gray-500"
							: "bg-gray-800"
					}`}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					{isHover ? (
						<ShortcutActions
							action={action}
							handleActions={handleActions}
						/>
					) : null}
					<div></div>
					<div
						className={`font-medium py-4 line-clamp-4 text-center ${
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
								states.find(
									(state) =>
										state.id === Number(action.state_id)
								)?.slug
							}`}
						></div>

						<div className="text-[10px] text-gray-400">
							{format(parseISO(action.date), "E, d 'de' MMM", {
								locale: ptBR,
							})}
						</div>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuItems
				action={action}
				categories={categories}
				handleActions={handleActions}
				states={states}
				priorities={priorities}
			/>
		</ContextMenu>
	);
}

export function ListOfActions({
	actions,
	categories,
	states,
	priorities,
	hideDate,
	hasShortDate,
	showCategory,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
	priorities: Priority[];
	hideDate?: boolean;
	hasShortDate?: boolean;
	showCategory?: boolean;
}) {
	return (
		<div className="scrollbars">
			<div className="min-h-full gap-1 flex flex-col @container">
				{actions?.map((action) => (
					<ActionLine
						action={action}
						categories={categories}
						states={states}
						priorities={priorities}
						key={action.id}
						hideDate={hideDate}
						hasShortDate={hasShortDate}
						showCategory={showCategory}
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
	priorities,
	max,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
	priorities: Priority[];
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
						priorities={priorities}
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
	priorities,
}: {
	actions?: Action[];
	categories: Category[];
	states: State[];
	priorities: Priority[];
}) {
	return (
		<div className="scrollbars">
			<div className="h-full grid grid-cols-3 gap-2 place-content-start">
				{actions?.map((action) => (
					<ActionGrid
						action={action}
						categories={categories}
						states={states}
						key={action.id}
						priorities={priorities}
					/>
				))}
			</div>
		</div>
	);
}

function ShortcutActions({
	action,
	handleActions,
}: {
	action: Action;
	handleActions: (data: { [key: string]: string | number }) => void;
}) {
	const navigate = useNavigate();

	useEffect(() => {
		const keyDown = async function (event: KeyboardEvent) {
			const key = event.key.toLowerCase();
			if (["i", "f", "z", "t", "a", "c"].find((k) => k === key)) {
				let state_id = 0;
				if (key === "i") {
					state_id = 1;
				}
				if (key === "f") {
					state_id = 2;
				}
				if (key === "z") {
					state_id = 3;
				}
				if (key === "a") {
					state_id = 4;
				}
				if (key === "t") {
					state_id = 5;
				}
				if (key === "c") {
					state_id = 6;
				}

				handleActions({
					action: "action-update",
					id: action.id,
					state_id,
				});
			}

			if (key === "e") {
				navigate(`/dashboard/action/${action.id}`);
			}
			if (key === "d") {
				handleActions({
					id: action.id,
					newId: window.crypto.randomUUID(),
					created_at: format(
						new Date(),
						"yyyy-MM-dd'T'hh:mm:ss'+03:00:00'"
					),
					updated_at: format(
						new Date(),
						"yyyy-MM-dd'T'hh:mm:ss'+03:00:00'"
					),
					action: "action-duplicate",
				});
			}

			if (key === "x") {
				handleActions({ id: action.id, action: "action-delete" });
			}
		};
		window.addEventListener("keydown", keyDown);

		return () => window.removeEventListener("keydown", keyDown);
	}, [action]);

	return <></>;
}

function ContextMenuItems({
	action,
	categories,
	states,
	priorities,
	handleActions,
}: {
	action: Action;
	categories: Category[];
	states: State[];
	priorities: Priority[];
	handleActions: (data: { [key: string]: string | number }) => void;
}) {
	const navigate = useNavigate();
	return (
		<ContextMenuContent className="bg-content">
			<ContextMenuItem
				className="bg-item focus:bg-primary flex gap-2 items-center"
				onSelect={() => navigate(`/dashboard/action/${action.id}`)}
			>
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
							{
								title: "Horas",
								periods: [
									{ time: 1, text: "1 hora" },
									{ time: 3, text: "3 horas" },
									{ time: 8, text: "8 horas" },
								],
							},
							{
								title: "Dias",
								periods: [
									{ time: 24, text: "1 dia" },
									{ time: 3 * 24, text: "3 dias" },
								],
							},
							{
								title: "Outros",
								periods: [
									{ time: 7 * 24, text: "1 semana" },
									{ time: 30 * 24, text: "1 mês" },
								],
							},
						].map((group, i) => (
							<Fragment key={i}>
								{i > 0 && (
									<ContextMenuSeparator
										key={`separator-${i}`}
										className="bg-gray-300/20"
									/>
								)}
								<ContextMenuLabel
									className="mx-2"
									key={`label-${i}`}
								>
									{group.title}
								</ContextMenuLabel>
								{group.periods.map((period) => (
									<ContextMenuItem
										key={`period-${period.time}`}
										className="bg-item focus:bg-primary flex gap-2 items-center"
										onSelect={() => {
											let date = format(
												addHours(
													new Date().setHours(
														parseISO(
															action.date
														).getHours(),
														parseISO(
															action.date
														).getMinutes()
													),
													period.time
												),
												"yyyy-MM-dd h:m:s"
											);

											handleActions({
												action: "action-update",
												id: action.id,
												date,
											});
										}}
									>
										{period.text}
									</ContextMenuItem>
								))}
							</Fragment>
						))}
					</ContextMenuSubContent>
				</ContextMenuPortal>
			</ContextMenuSub>
			{/* Deletar */}
			<ContextMenuItem className="bg-item focus:bg-primary flex gap-2 items-center">
				<TrashIcon className="w-3 h-3" />
				<span>Deletar</span>
			</ContextMenuItem>
			<ContextMenuSeparator className="bg-gray-300/20 " />
			{/* Prioridade */}
			<ContextMenuSub>
				<ContextMenuSubTrigger className="bg-item focus:bg-primary flex gap-2 items-center">
					<Icons
						id={
							priorities.find(
								(priority) => priority.id === action.priority_id
							)?.slug
						}
						className="w-3 h-3"
						type="priority"
					/>
					<span>
						{
							priorities.find(
								(priority) => priority.id === action.priority_id
							)?.title
						}
					</span>
				</ContextMenuSubTrigger>
				<ContextMenuPortal>
					<ContextMenuSubContent className="bg-content">
						{priorities.map((priority) => (
							<ContextMenuItem
								key={priority.id}
								className="bg-item flex gap-2 items-center"
								onSelect={() => {
									handleActions({
										id: action.id,
										priority_id: priority.id,
										action: "action-update",
									});
								}}
							>
								<Icons
									id={priority.slug}
									type="priority"
									className="w-3 h-3"
								/>
								{priority.title}
							</ContextMenuItem>
						))}
					</ContextMenuSubContent>
				</ContextMenuPortal>
			</ContextMenuSub>
			{/* Categoria */}
			<ContextMenuSub>
				<ContextMenuSubTrigger className="bg-item focus:bg-primary flex gap-2 items-center">
					<Icons
						id={
							categories.find(
								(category) => category.id === action.category_id
							)?.slug
						}
						className="w-3 h-3"
					/>
					<span>
						{
							categories.find(
								(category) =>
									category.id === Number(action.category_id)
							)?.title
						}
					</span>
				</ContextMenuSubTrigger>
				<ContextMenuPortal>
					<ContextMenuSubContent className="bg-content">
						{categories.map((category) => (
							<ContextMenuItem
								key={category.id}
								className="bg-item flex gap-2 items-center"
								onSelect={() => {
									handleActions({
										id: action.id,
										category_id: category.id,
										action: "action-update",
									});
								}}
							>
								<Icons id={category.slug} className="w-3 h-3" />
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
								(state) => state.id === Number(action.state_id)
							)?.slug
						}`}
					></div>
					<span>
						{
							states.find(
								(state) => state.id === Number(action.state_id)
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
	);
}

export function formatActionDatetime({
	date,
	hasShortDate,
	hasTime,
	isDistance,
}: {
	date: Date | string;
	hasShortDate?: boolean;
	hasTime?: boolean;
	isDistance?: boolean;
}) {
	date = typeof date === "string" ? parseISO(date) : date;

	return isDistance
		? formatDistanceToNow(date, { locale: ptBR, addSuffix: true })
		: hasShortDate
		? format(
				date,
				`d/M${
					!isSameYear(date.getFullYear(), new Date().getUTCFullYear())
						? "/yy"
						: ""
				}`,
				{ locale: ptBR }
		  )
		: format(
				date,
				`d 'de' MMM${
					!isSameYear(date.getFullYear(), new Date().getUTCFullYear())
						? " 'de' y"
						: ""
				}`.concat(
					hasTime
						? ` 'às' H'h'${!(date.getMinutes() === 0) ? "m" : ""}`
						: ""
				),
				{ locale: ptBR }
		  );
}
