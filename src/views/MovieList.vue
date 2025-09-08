<template>
  <main>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
    <MovieCard> </MovieCard>
  </main>
</template>

<script setup lang="ts">
import MovieCard from '@/components/MovieCard.vue'
import { fetchMovieList } from '@/services/useApiServices'

import { onMounted, ref } from 'vue'

// fetch Movie list and assign them to variable

const UpcomingMovieList = ref<any[]>([])
const presentMovieList = ref<any[]>([])

const retriveMovieList = async () => {
  try {
    const res = await fetchMovieList(0, 1, '', '')

    res.data.data.movies.forEach((obj: any) => {
      if (obj.categories.includes('Upcoming')) {
        UpcomingMovieList.value.push(obj)
      } else {
        presentMovieList.value.push(obj)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  retriveMovieList()
})
</script>
