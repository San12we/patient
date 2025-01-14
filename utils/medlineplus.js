
import axios from 'axios';

const MEDLINEPLUS_BASE_URL = 'https://wsearch.nlm.nih.gov/ws/query';

export const fetchMedlinePlusData = async (searchTerm) => {
  try {
    const response = await axios.get(MEDLINEPLUS_BASE_URL, {
      params: {
        db: 'healthTopics',
        term: searchTerm,
        retmax: 10,
        retmode: 'json',
      },
    });

    return response.data.list;
  } catch (error) {
    console.error('Error fetching MedlinePlus data:', error);
    throw error;
  }
};