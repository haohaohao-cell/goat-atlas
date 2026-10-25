export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // 防止数据里的 "</script>" 提前闭合标签
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
