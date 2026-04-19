const axios = require('axios');

const fetchJobRecommendations = async (jobRole, company) => {
  try {
    const apiKey = process.env.JSEARCH_API_KEY;
    if (!apiKey) {
      console.warn('JSEARCH_API_KEY not set');
      return [];
    }

    // Try multiple queries in order until we get results
    const queries = [
      `${jobRole} Bengaluru India`,
      `${jobRole} Hyderabad India`,
      `${jobRole} India`,
      `${jobRole} remote India`,
    ];

    let allJobs = [];

    for (const query of queries) {
      try {
        console.log('Trying JSearch query:', query);
        const response = await axios.get(
          'https://jsearch.p.rapidapi.com/search',
          {
            params: {
              query,
              page: '1',
              num_pages: '2',
              date_posted: 'all',
              country: 'in',
            },
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
            timeout: 12000,
          }
        );

        const jobs = response.data?.data || [];
        console.log(`Query "${query}" returned ${jobs.length} jobs`);

        if (jobs.length > 0) {
          allJobs = jobs;
          break; // Stop at first query that gives results
        }
      } catch (queryErr) {
        console.error(`Query failed for "${query}":`, queryErr.message);
        continue;
      }
    }

    if (allJobs.length === 0) {
      console.log('JSearch returned 0 results for all queries');
      return [];
    }

    // India location keywords
    const indiaKeywords = [
      'india', 'bengaluru', 'bangalore', 'hyderabad', 'gurgaon',
      'gurugram', 'mumbai', 'pune', 'chennai', 'noida', 'delhi',
      'kolkata', 'remote', 'in'
    ];

    // Filter India jobs
    const indiaJobs = allJobs.filter((job) => {
      const city = (job.job_city || '').toLowerCase();
      const country = (job.job_country || '').toLowerCase();
      const state = (job.job_state || '').toLowerCase();
      const locationStr = `${city} ${state} ${country}`;
      return (
        country === 'in' ||
        indiaKeywords.some((kw) => locationStr.includes(kw))
      );
    });

    console.log(`India-filtered jobs: ${indiaJobs.length}`);
    const finalJobs = indiaJobs.length >= 2 ? indiaJobs : allJobs;

    // Map to frontend format
    return finalJobs.slice(0, 6).map((job) => {
      const city = job.job_city || '';
      const state = job.job_state || '';
      const country = job.job_country === 'IN' ? 'India' : (job.job_country || 'India');
      const location = [city, state, country].filter(Boolean).join(', ');

      const postedAt = job.job_posted_at_datetime_utc || null;

      return {
        company: job.employer_name || 'Tech Company',
        role: job.job_title || jobRole,
        location: location || 'India',
        applyUrl: job.job_apply_link || job.job_google_link || '#',
        matchReason: job.job_description
          ? job.job_description.slice(0, 150).replace(/\n/g, ' ') + '...'
          : `Actively hiring for ${jobRole} in India`,
        postedAt,
        employerLogo: job.employer_logo || null,
        isRemote: job.job_is_remote || false,
      };
    });

  } catch (err) {
    console.error('Job search fatal error:', err.message);
    return [];
  }
};

module.exports = { fetchJobRecommendations };
