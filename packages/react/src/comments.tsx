import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "./utils/cn";
import {
	CommentsProvider,
	CommentsPost,
	CommentsList,
	type CommentsProviderProps,
} from "./atom";

export type CommentsProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	keyof CommentsProviderProps | keyof InnerProps
> &
	CommentsProviderProps &
	InnerProps;

interface InnerProps {
	title?: ReactNode;
	placeholder?: string;
	noCommentsMessage?: string;
	replyButtonText?: string;
	repliesButtonText?: string;

	/**
	 * title to show when the user has not logged in.
	 *
	 * Fallbacks to default `title` when not specified.
	 * @deprecated No longer used.
	 */
	titleUnauthorized?: ReactNode;

	editor?: ComponentProps<typeof CommentsPost>;
}

export const Comments = forwardRef<HTMLDivElement, CommentsProps>(
	(
		{
			page,
			className,
			title,
			storage,
			editor,
			mention,
			auth,
			apiUrl,
			placeholder,
			noCommentsMessage,
			replyButtonText,
			repliesButtonText,
			...props
		},
		ref,
	) => {
		return (
			<CommentsProvider
				page={page}
				apiUrl={apiUrl}
				auth={auth}
				storage={storage}
				mention={mention}
			>
				<div
					className={cn(
						"overflow-hidden rounded-xl border border-fc-border bg-fc-background text-fc-foreground",
						className,
					)}
					ref={ref}
					{...props}
				>
					<div className="relative flex flex-col gap-2">
						{title}
						<CommentsPost placeholder={placeholder}/>
					</div>
					<CommentsList
						noCommentsMessage={noCommentsMessage}
						replyButtonText={replyButtonText}
						repliesButtonText={repliesButtonText}
						/>
				</div>
			</CommentsProvider>
		);
	},
);

Comments.displayName = "Comments";
