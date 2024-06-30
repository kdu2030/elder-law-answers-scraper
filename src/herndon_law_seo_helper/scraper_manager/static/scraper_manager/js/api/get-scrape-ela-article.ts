type GetScrapeElaArticleResponse = {
  isError: boolean;
  error?: string;
};

const getScrapeElaArticle = async () => {
  const url = "/api/scrape-ela-article";

  try {
    const response = await fetch(url);
    return response.json() as Promise<GetScrapeElaArticleResponse>;
  } catch (error) {
    console.log(error);
    return { isError: true };
  }
};
