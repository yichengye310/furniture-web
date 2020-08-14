<template>
  <div class="app-container">
    <activity-list :page-type="5" />
  </div>
</template>

<script>
import ActivityList from './components/snapped-up/ActivityList'

export default {
  name: 'SnappedUp',
  components: { ActivityList },
  methods: {

  }
}
</script>
