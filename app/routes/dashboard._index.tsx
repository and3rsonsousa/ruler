import { useLoaderData, useMatches } from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@vercel/remix";
import {
	BriefcaseIcon,
	ListTodoIcon,
	MoonStarIcon,
	UserCircle2Icon,
} from "lucide-react";
import { ActionBlock, ActionLine } from "~/components/structure/Action";
import { ScrollArea } from "~/components/ui/ui/scroll-area";
import {
	getLateActions,
	getNotFinishedActions,
	getTodayActions,
} from "~/lib/helpers";
import createServerClient from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);
	const { data: actions } = await supabase.from("actions").select("*");
	return json({ headers, actions });
}

export const meta: MetaFunction = () => {
	return [
		{
			title: "Dashboard / ʀᴜʟeʀ",
		},
	];
};

export default function DashboardIndex() {
	const { actions } = useLoaderData<typeof loader>();
	const { categories, people, states, clients } = useMatches()[1]
		.data as DashboardDataType;

	return (
		<ScrollArea className="h-full">
			<div className="py-8 flex flex-col gap-8">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
					{[
						{
							id: 1,
							title: "Clientes",
							data: clients.length,
							icon: (
								<BriefcaseIcon className="w-8 text-gray-400" />
							),
						},
						{
							id: 2,
							title: "Usuários",
							data: people.length,
							icon: (
								<UserCircle2Icon className="w-8 text-gray-400" />
							),
						},
						{
							id: 3,
							title: "Ações",
							data: actions?.length,
							icon: (
								<ListTodoIcon className="w-8 text-gray-400" />
							),
						},
						{
							id: 4,
							title: "em Atraso",
							data: getLateActions(actions)?.length,
							icon: (
								<MoonStarIcon className="w-8 text-gray-400" />
							),
						},
					].map((item) => (
						<div
							className="bg-gray-900 hover:bg-primary/20 flex gap-2 justify-between items-center p-4 rounded-xl"
							key={item.id}
						>
							{item.icon}
							<span className="font-semibold tracking-tight text-sm">
								{item.data} {item.title}
							</span>
						</div>
					))}
				</div>
				{/* Ações de hoje */}
				<div>
					<h1 className="mb-4 text-2xl font-semibold tracking-tight">
						Hoje
					</h1>
					<div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
						{getTodayActions(actions)?.map((action) => (
							<ActionLine
								key={action.id}
								action={action}
								states={states}
								categories={categories}
							/>
						))}
					</div>
				</div>
				{/* Ações em atraso */}
				<div>
					<h1 className="mb-4 text-2xl font-semibold tracking-tight">
						Ações em atraso
					</h1>
					<div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
						{getLateActions(actions)?.map((action) => (
							<ActionLine
								key={action.id}
								action={action}
								states={states}
								categories={categories}
							/>
						))}
					</div>
				</div>
				{/* Ações a fazer */}
				<div>
					<h1 className="mb-4 text-2xl font-semibold tracking-tight">
						Ações para fazer
					</h1>
					<div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
						{getNotFinishedActions(actions)?.map((action) => (
							<ActionLine
								key={action.id}
								action={action}
								states={states}
								categories={categories}
							/>
						))}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
