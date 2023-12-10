import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import createServerClient from "~/lib/supabase";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const [headers, supabase] = createServerClient(request);
	const { id } = params;

	if (!id) throw new Error("$id não foi definido");

	const { data: action } = await supabase
		.from("actions")
		.select("*")
		.eq("id", id)
		.single();

	return json({ headers, action });
};

export default function ActionPage() {
	const { action } = useLoaderData<typeof loader>();
	return (
		<div>
			<pre>{JSON.stringify(action, undefined, 2)}</pre>
		</div>
	);
}
