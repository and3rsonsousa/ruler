import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import {
	format,
	formatDistance,
	formatDistanceToNow,
	parseISO,
	subHours,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import createServerClient from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);
	const { data: actions } = await supabase
		.from("actions")
		.select("*")
		.gte("date", "2023-12-08T00:00:00")
		.lte("date", "2023-12-08T23:59:59");

	return json({ headers, actions });
}

export default function Test() {
	const { actions } = useLoaderData<typeof loader>();

	return (
		<div className="scrollbars">
			<div className="h-full">
				{actions?.map((action) => (
					<div
						key={action.id}
						className="py-1 font-semibold flex justify-between"
					>
						<div>{action.title}</div>
						<div className="text-center">
							{formatDistanceToNow(
								subHours(parseISO(action.updated_at), 3),
								{
									locale: ptBR,
								}
							)}
							{" - "}
						</div>
						<div>
							{subHours(
								parseISO(action.updated_at),
								3
							).toISOString()}
						</div>
						<div>{new Date().toISOString()}</div>
					</div>
				))}
			</div>
		</div>
	);
}
