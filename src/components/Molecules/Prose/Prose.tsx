import ReactMarkdown from "react-markdown";

export const Prose = ({
  children,
  size = "base",
}: {
  children: string;
  size?: "sm" | "base";
}) => (
  <div
    className={`font-serif text-ink ${
      size === "sm" ? "text-base leading-7" : "text-lg leading-8"
    }`}
  >
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        ol: ({ children }) => (
          <ol className="my-3 ml-5 list-outside list-decimal space-y-1.5">
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className="my-3 ml-5 list-outside list-disc space-y-1.5">
            {children}
          </ul>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);
