export const TMBD_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: "process.env.EXPO_PUBLIC_MOVIE_API_KEY",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async (
  { query }: { query: string },
  page: number = 1
) => {
  const endpoint = query
    ? `${TMBD_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMBD_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&include_adult=false`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: TMBD_CONFIG.headers,
  });

  if (!res.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch movies", res.statusText);
  }

  const data = await res.json();

  return data.results;
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMBD_CONFIG.BASE_URL}/movie/${id}?api_key=${TMBD_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMBD_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
