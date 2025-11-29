async function getRawSortedPosts() {
  const allBlogPosts = await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // 自定义排序逻辑
  const sorted = allBlogPosts.sort((a, b) => {
    // 第一优先级：按 order 字段排序（1 > 0 > -1）
    if (a.data.order !== b.data.order) {
      return b.data.order - a.data.order; // 降序：置顶(1)在前，置底(-1)在后
    }

    // 第二优先级：order 相同时，按发布日期倒序（新文章在前）
    const dateA = new Date(a.data.published);
    const dateB = new Date(b.data.published);
    return dateA > dateB ? -1 : 1;
  });

  return sorted;
}

export async function getSortedPosts() {
  const sorted = await getRawSortedPosts();

  // 保持原有的前后文章链接逻辑不变
  for (let i = 1; i < sorted.length; i++) {
    sorted[i].data.nextSlug = sorted[i - 1].slug;
    sorted[i].data.nextTitle = sorted[i - 1].data.title;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].data.prevSlug = sorted[i + 1].slug;
    sorted[i].data.prevTitle = sorted[i + 1].data.title;
  }

  return sorted;
}
