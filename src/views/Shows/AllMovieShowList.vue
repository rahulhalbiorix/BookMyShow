<template>
  <div class="bg-green-200">
    {{ MovieId }}
  </div>
  <div class="bg-red-200">
    {{ ShowData }}
  </div>
</template>

<script lang="ts" setup>
import { fetchUserListShow } from '@/services/useApiServices'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const MovieId = ref('')

const route = useRoute()

const ShowData = ref([])

MovieId.value = route.params.movieId as string

const fetchMovieShowList = async () => {
  try {
    const Todaydate = new Date()

    const formattedDate = Todaydate.toISOString().split('T')[0]

    const res = await fetchUserListShow('', '', MovieId.value, formattedDate)

    if (res.data.success) {
      ShowData.value = res.data.data
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchMovieShowList()
})
</script>
