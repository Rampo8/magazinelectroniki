<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-carousel hide-delimiter-background show-arrows="hover">
            <v-carousel-item
              v-for="ad in promoAds"
              :key="ad.id"
              :src="ad.src"
              cover
            >
              <div class="ad-link">
                <v-btn color="error" :to="'/ad/' + ad.id">{{ ad.title }}</v-btn>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col
          v-for="ad in ads"
          :key="ad.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="mb-4">
            <v-img :src="ad.src" height="200px" cover></v-img>
            <v-card-title>
              <h3 class="headline mb-0">{{ ad.title }}</h3>
            </v-card-title>
            <v-card-text>
              <div>{{ ad.desc }}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text :to="'/ad/' + ad.id">Open</v-btn>
              <buy-ad-modal :ad="ad"></buy-ad-modal>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    promoAds() { return this.$store.getters['ads/promoAds'] },
    ads() { return this.$store.getters['ads/allAds'] }
  }
}
</script>

<style scoped>
.ad-link {
  position: absolute;
  bottom: 50px;
  left: 50%;
  background: rgba(0,0,0,0.5);
  transform: translate(-50%,0);
  padding: 5px 15px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
</style>