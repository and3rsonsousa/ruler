import { Outlet } from "@remix-run/react";
import { redirect, type LoaderFunctionArgs } from "@vercel/remix";
import Layout from "~/components/structure/Layout";
import createServerClient from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
	const [headers, supabase] = createServerClient(request);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) return redirect("/auth/login", { headers });

	const [
		{ data: clients },
		{ data: people },
		{ data: categories },
		{ data: states },
	] = await Promise.all([
		supabase
			.from("clients")
			.select("*")
			.order("title", { ascending: true }),
		supabase.from("people").select("*").order("name", { ascending: true }),
		supabase
			.from("categories")
			.select("*")
			.order("priority", { ascending: true }),
		supabase.from("states").select("*").order("order", { ascending: true }),
	]);

	return { clients, people, categories, states, session, headers };
}

export default function Dashboard() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
