import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@vercel/remix";
import createServerClient from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		const { data: user } = await supabase
			.from("people")
			.select("*")
			.eq("user_id", session.user.id)
			.single();

		if (user?.admin) {
			return { data: "OK" };
		}
		return redirect("/dashboard");
	}

	return redirect("/");
}

export default function DashboardAdmin() {
	const data = useLoaderData();
	return (
		<div>
			<pre>{JSON.stringify(data, undefined, 2)}</pre>

			<Outlet />
		</div>
	);
}
