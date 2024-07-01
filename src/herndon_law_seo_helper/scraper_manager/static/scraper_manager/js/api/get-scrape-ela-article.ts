type GetScrapeElaArticleResponse = {
  isError?: boolean;
  error?: string;
  isWarning?: boolean;
  warning?: string;
};

const getScrapeElaArticle = async (): Promise<GetScrapeElaArticleResponse> => {
  const url = "/api/scrape-ela-article";

  try {
    const response = await fetch(url);
    return response.json() as Promise<GetScrapeElaArticleResponse>;
  } catch (error) {
    return { isError: true };
  }
};
