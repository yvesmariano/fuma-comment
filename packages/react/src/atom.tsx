"use client";

import {
	useMemo,
	type ReactNode,
	type HTMLAttributes,
	forwardRef,
	type ButtonHTMLAttributes,
} from "react";
import { CommentsProvider as Provider } from "./contexts/comments";
import {
	AuthProvider,
	type AuthOptions,
	useAuthContext,
} from "./contexts/auth";
import { cn } from "./utils/cn";
import { CreateForm } from "./components/comment/create-form";
import { CommentList } from "./components/comment/list";
import { type MentionOptions, MentionProvider } from "./contexts/mention";
import { type StorageContext, StorageProvider } from "./contexts/storage";
import { createFetcher } from "./utils/fetcher";

export interface CommentsProviderProps {
	/**
	 * Comments will be grouped by `page`
	 */
	page: string;

	auth: AuthOptions;

	mention?: MentionOptions;

	storage?: StorageContext;

	/**
	 * The URL of the API endpoint.
	 *
	 * If not specified, the API will be fetched from `/api/comments`.
	 */
	apiUrl?: string;

	children?: ReactNode;
}

export function CommentsProvider({
	page,
	children,
	mention,
	storage,
	auth,
	apiUrl,
}: CommentsProviderProps): React.ReactNode {
	let child = children;
	const context = useMemo(
		() => ({
			page,
			fetcher: createFetcher(apiUrl),
		}),
		[page, apiUrl],
	);

	if (mention)
		child = <MentionProvider mention={mention}>{child}</MentionProvider>;

	if (storage)
		child = <StorageProvider storage={storage}>{child}</StorageProvider>;

	return (
		<Provider value={context}>
			<AuthProvider page={page} auth={auth}>
				{child}
			</AuthProvider>
		</Provider>
	);
}

export const CommentsPost = CreateForm;

export const CommentsList = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement> & {
		noCommentsMessage?: string;
		replyButtonText?: string;
		repliesButtonText?: string;
		replyPlaceholder?: string;
		replyToText?: string;
	}
>(({ className, noCommentsMessage, replyButtonText, repliesButtonText, replyPlaceholder, replyToText, ...props }, ref) => {
	return (
		<div className={cn("flex flex-col", className)} ref={ref} {...props}>
			<CommentList
				noCommentsMessage={noCommentsMessage}
				replyButtonText={replyButtonText}
				repliesButtonText={repliesButtonText}
				replyPlaceholder={replyPlaceholder}
				replyToText={replyToText}
				/>
		</div>
	);
});

CommentsList.displayName = "CommentsList";

export function AuthButton(
	props: ButtonHTMLAttributes<HTMLButtonElement>,
): React.ReactNode {
	const { signIn } = useAuthContext();

	if (typeof signIn === "function")
		return (
			<button {...props} onClick={signIn} type="button">
				{props.children ?? "Sign In"}
			</button>
		);

	return signIn;
}

export { Comment, CommentMenu } from "./components/comment/index";
export { ContentRenderer } from "./components/comment/content-renderer";
