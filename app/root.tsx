import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRevalidator,
} from "@remix-run/react";

import { createBrowserClient } from "@supabase/ssr";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { Database } from "database";
import { useEffect, useState } from "react";
import "./globals.css";
import createServerClient from "./lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
	const env = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	};

	const [headers, supabase] = createServerClient(request);

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return json({
		session,
		env,
	});
}

export default function App() {
	const { env, session } = useLoaderData<typeof loader>();
	const { revalidate } = useRevalidator();

	const [supabase] = useState(() =>
		createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
	);

	const serverAccessToken = session?.access_token;

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (
				event !== "INITIAL_SESSION" &&
				session?.access_token !== serverAccessToken
			) {
				revalidate();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [serverAccessToken, supabase, revalidate]);

	return (
		<html lang="pt-br" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet context={{ supabase }} />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
