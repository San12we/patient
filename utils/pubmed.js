import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export const fetchPubMedData = async (searchTerm) => {
  try {
    // Fetch article IDs
    const searchResponse = await axios.get(`${PUBMED_BASE_URL}/esearch.fcgi`, {
      params: {
        db: 'pubmed',
        term: searchTerm,
        retmax: 10, // Number of results to fetch
        retmode: 'json',
      },
    });

    const ids = searchResponse.data.esearchresult.idlist.join(',');

    // Fetch detailed metadata
    const detailsResponse = await axios.get(`${PUBMED_BASE_URL}/esummary.fcgi`, {
      params: {
        db: 'pubmed',
        id: ids,
        retmode: 'json',
      },
    });

    return detailsResponse.data.result;
  } catch (error) {
    console.error('Error fetching PubMed data:', error);
    throw error;
  }
};

export const fetchRelatedArticles = async (articleId) => {
  try {
    const response = await axios.get(`${PUBMED_BASE_URL}/elink.fcgi`, {
      params: {
        dbfrom: 'pubmed',
        linkname: 'pubmed_pubmed',
        id: articleId,
        retmode: 'json',
      },
    });

    return response.data.linksets[0].linksetdbs[0].links;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    throw error;
  }
};

export const fetchFullArticle = async (articleId) => {
  try {
    const response = await axios.get(`${PUBMED_BASE_URL}/efetch.fcgi`, {
      params: {
        db: 'pubmed',
        id: articleId,
        retmode: 'xml',
      },
    });

    const parsedData = await parseStringPromise(response.data);
    const article = parsedData.PubmedArticleSet.PubmedArticle[0];
    const abstractText = article.MedlineCitation[0].Article[0].Abstract[0].AbstractText[0];

    return abstractText;
  } catch (error) {
    console.error('Error fetching full article:', error);
    throw error;
  }
};
