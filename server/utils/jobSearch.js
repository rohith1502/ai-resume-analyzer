const axios = require('axios');

// Priority scoring function for job recommendations
const getPriorityScore = (employerName, jobDescription) => {
  const employer = (employerName || '').toLowerCase();
  const description = (jobDescription || '').toLowerCase();

  // Tier 1: FAANG/MAANG and top tech companies (score: 40)
  const tier1Companies = [
    'google', 'meta', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix',
    'openai', 'anthropic', 'nvidia', 'salesforce', 'adobe', 'intel', 'uber',
    'airbnb', 'linkedin', 'twitter', 'x', 'stripe', 'figma', 'atlassian', 'canva', 'shopify'
  ];
  if (tier1Companies.some(company => employer.includes(company))) {
    return 40;
  }

  // Tier 2: Product-based companies (score: 30)
  const tier2Companies = [
    'razorpay', 'zerodha', 'cred', 'swiggy', 'zomato', 'meesho', 'groww',
    'phonepe', 'paytm', 'byju', 'ola', 'dunzo', 'freshworks', 'zoho', 'postman'
  ];
  if (tier2Companies.some(company => employer.includes(company))) {
    return 30;
  }

  // Tier 4: Service-based companies (score: 10)
  const tier4Companies = [
    'infosys', 'wipro', 'tcs', 'hcl', 'cognizant', 'accenture', 'capgemini', 'tech mahindra'
  ];
  if (tier4Companies.some(company => employer.includes(company))) {
    return 10;
  }

  // Tier 3: Funded startups / AI startups (score: 20)
  const startupKeywords = ['ai', 'startup', 'series', 'ventures'];
  if (startupKeywords.some(keyword => employer.includes(keyword) || description.includes(keyword))) {
    return 20;
  }

  // Default: Unknown/unclassified (score: 5)
  return 5;
};

const fetchJobRecommendations = async (jobRole, company, page = 1) => {
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
              page: page.toString(),
              num_pages: '1',
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

    // Add priority scores and sort by priority descending
    const jobsWithPriority = finalJobs.map((job) => ({
      ...job,
      priorityScore: getPriorityScore(job.employer_name, job.job_description)
    }));

    jobsWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

    // Deduplicate within the same page response
    const seen = new Set();
    const dedupedJobs = jobsWithPriority.filter(job => {
      const uniqueKey = `${job.employer_name}-${job.job_title}-${job.job_city}`.toLowerCase().replace(/\s+/g, '-');
      if (seen.has(uniqueKey)) return false;
      seen.add(uniqueKey);
      return true;
    });

    // Map to frontend format (top 6 jobs)
    return dedupedJobs.slice(0, 6).map((job) => {
      const city = job.job_city || '';
      const state = job.job_state || '';
      const country = job.job_country === 'IN' ? 'India' : (job.job_country || 'India');
      const location = [city, state, country].filter(Boolean).join(', ');

      const postedAt = job.job_posted_at_datetime_utc || null;
      const uniqueKey = `${job.employer_name}-${job.job_title}-${job.job_city}`.toLowerCase().replace(/\s+/g, '-');

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
        unique_key: uniqueKey,
      };
    });

  } catch (err) {
    console.error('Job search fatal error:', err.message);
    return [];
  }
};

module.exports = { fetchJobRecommendations };
