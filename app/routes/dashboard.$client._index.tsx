import { useFetchers, useMatches } from "@remix-run/react";
import { ActionFunctionArgs, MetaFunction } from "@vercel/remix";
import {
	BlockOfActions,
	GridOfActions,
	ListOfActions,
} from "~/components/structure/Action";
import { MicroHeader } from "~/components/structure/Headings";
import {
	getInstagramActions,
	getLateActions,
	getNotFinishedActions,
	getTodayActions,
} from "~/lib/helpers";

export const meta: MetaFunction = ({ matches }) => {
	const { client } = matches[2].data as DashboardClientType;

	return [
		{
			title: `${matches[2].data ? client.title : "Dashboard"} / ʀᴜʟeʀ`,
		},
		{ name: "description", content: "Rule your task" },
	];
};

export default function ClientPage() {
	const matches = useMatches();
	const { actions } = matches[2].data as DashboardClientType;
	const { categories, states, priorities } = matches[1]
		.data as DashboardDataType;

	let optimisticActions = actions;

	return (
		<>
			<div className="md:flex h-full overflow-hidden gap-8">
				<div className="h-full flex flex-col gap-4 overflow-hidden md:w-1/2 xl:w-3/5">
					<div className="w-full max-h-[25%] flex flex-col">
						<MicroHeader>Hoje</MicroHeader>
						<BlockOfActions
							actions={getTodayActions(optimisticActions)}
							categories={categories}
							states={states}
							max={2}
							priorities={priorities}
						/>
					</div>
					{getLateActions({ actions: optimisticActions })?.length ? (
						<div className="flex-shrink-0 max-h-[50%] flex flex-col overflow-hidden space-y-1">
							<MicroHeader>Atrasados</MicroHeader>
							<ListOfActions
								actions={getLateActions({
									actions: optimisticActions,
								})}
								categories={categories}
								priorities={priorities}
								states={states}
								showCategory={true}
								date={{
									dateFormat: 4,
									timeFormat: 1,
								}}
							/>
						</div>
					) : null}
					<div className="flex flex-grow flex-col space-y-1 overflow-hidden">
						<MicroHeader>Próximas Ações</MicroHeader>
						<ListOfActions
							actions={getNotFinishedActions(optimisticActions)}
							categories={categories}
							priorities={priorities}
							states={states}
							showCategory={true}
							date={{
								dateFormat: 4,
								timeFormat: 1,
							}}
						/>
					</div>
				</div>

				<div className="md:w-1/2 xl:w-2/5 h-full">
					<MicroHeader>Instagram</MicroHeader>
					<GridOfActions
						actions={getInstagramActions(optimisticActions)}
						categories={categories}
						states={states}
						priorities={priorities}
					/>
				</div>
			</div>
		</>
	);
}
