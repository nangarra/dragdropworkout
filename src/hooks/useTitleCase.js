const useTitleCase = (title) => {
  const normalizedTitle = title.trim().toLowerCase();
  const slug = normalizedTitle.replace(/\W+/g, "-");
  return slug.replace(/-+$|^-+/, "");
};

export default useTitleCase;
