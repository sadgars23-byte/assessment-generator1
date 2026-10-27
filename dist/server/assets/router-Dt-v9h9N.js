import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-aXKx_Ujh.css";
//#endregion
//#region src/components/Navbar.tsx
function Navbar() {
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5",
			children: [/* @__PURE__ */ jsxs(Link, {
				to: "/",
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ jsx("span", {
					className: "flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground",
					children: /* @__PURE__ */ jsx(GraduationCap, { className: "size-5" })
				}), /* @__PURE__ */ jsx("span", {
					className: "font-heading text-base font-bold tracking-tight sm:text-lg",
					children: "AI Assessment Generator"
				})]
			}), /* @__PURE__ */ jsxs("nav", {
				className: "flex items-center gap-5 text-sm font-medium text-muted-foreground",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/",
					activeProps: { className: "text-foreground" },
					className: "hover:text-foreground",
					children: "Home"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/create",
					activeProps: { className: "text-foreground" },
					className: "hover:text-foreground",
					children: "Create"
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$3 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AI Assessment Generator" },
			{
				name: "description",
				content: "Upload an assessment PDF and get a combined document with the original paper plus AI-written answers."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$3.useRouteContext();
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex min-h-screen flex-col bg-background",
			children: [
				/* @__PURE__ */ jsx(Navbar, {}),
				/* @__PURE__ */ jsx("main", {
					className: "flex-1",
					children: /* @__PURE__ */ jsx(Outlet, {})
				}),
				/* @__PURE__ */ jsx("footer", {
					className: "border-t border-border py-6 text-center text-sm text-muted-foreground",
					children: "AI Assessment Generator — answers are AI generated; always review before submission."
				})
			]
		}), /* @__PURE__ */ jsx(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$2 = () => import("./routes-ryNBtuXD.js");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "AI Assessment Generator — Answer Any Assessment PDF" },
		{
			name: "description",
			content: "Upload an assessment PDF and get structured, mark-aware answers with diagrams, code and a Times New Roman answer document merged with the original."
		},
		{
			property: "og:title",
			content: "AI Assessment Generator"
		},
		{
			property: "og:description",
			content: "Upload an assessment PDF and get mark-aware answers, diagrams and code in one professionally formatted document."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/create.tsx
var $$splitComponentImporter$1 = () => import("./create-CAA-SLcO.js");
var Route$1 = createFileRoute("/create")({
	head: () => ({ meta: [
		{ title: "Create Answers — AI Assessment Generator" },
		{
			name: "description",
			content: "Enter your student details, upload your assessment PDF and let the AI generate validated, mark-aware answers."
		},
		{
			property: "og:title",
			content: "Create Answers — AI Assessment Generator"
		},
		{
			property: "og:description",
			content: "Upload an assessment PDF and generate validated, mark-aware answers."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/preview.tsx
var $$splitComponentImporter = () => import("./preview-CO-NZkQo.js");
var Route = createFileRoute("/preview")({
	head: () => ({ meta: [
		{ title: "Answer Preview — AI Assessment Generator" },
		{
			name: "description",
			content: "Review the analysed assessment, edit or regenerate answers, and download the merged final PDF."
		},
		{
			property: "og:title",
			content: "Answer Preview — AI Assessment Generator"
		},
		{
			property: "og:description",
			content: "Review generated answers and download the merged final assessment PDF."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	CreateRoute: Route$1.update({
		id: "/create",
		path: "/create",
		getParentRoute: () => Route$3
	}),
	PreviewRoute: Route.update({
		id: "/preview",
		path: "/preview",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
