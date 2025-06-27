import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: fetchMoviesData,
  } = useFetch(() => fetchMovies({ query: "" }));

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setPage((prev) => prev + 1);
    await fetchMoviesData();
    setIsLoadingMore(false);
  };

  useEffect(() => {
    const fetchMoreMovies = async () => {
      try {
        const newMovies = await fetchMovies({ query: "" }, page);
        if (page === 1) {
          setAllMovies(newMovies);
        } else {
          setAllMovies((prev) => [...prev, ...newMovies]);
        }
      } catch (error) {
        console.error("Movie fetch failed:", error);
      }
    };

    fetchMoreMovies();
  }, [page]);

  if ((moviesLoading && page === 1) || trendingMoviesLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (moviesError || trendingMoviesError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white">
          Error: {moviesError?.message || trendingMoviesError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary relative">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={allMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 50,
        }}
        ListHeaderComponent={
          <>
            <Image
              source={icons.logo}
              className="w-12 h-10 mb-5 mx-auto"
              resizeMode="contain"
            />
            <SearchBar
              value=""
              onPress={() => router.push("/search")}
              placeholder="Search for a Movie"
            />

            {trendingMovies && (
              <View className="mt-10 ml-5 ">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-7" />}
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  contentContainerStyle={{
                    paddingRight: 30,
                  }}
                />
              </View>
            )}

            <Text className="text-lg text-white font-bold mt-5 mb-3 px-5">
              Latest Movies
            </Text>
          </>
        }
        ListFooterComponent={
          <View className="flex-1 items-center mx-5 mt-5">
            <TouchableOpacity
              className="w-full h-10 bg-white rounded-lg justify-center items-center "
              onPress={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Text className="text-black font-semibold">Load More</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
