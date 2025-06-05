export const TMBD_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: "process.env.EXPO_PUBLIC_MOVIE_API_KEY",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMBD_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMBD_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: TMBD_CONFIG.headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movies", res.statusText);
  }

  const data = await res.json();

  return data.results;
};

// const url = 'https://api.themoviedb.org/3/discover/movie
