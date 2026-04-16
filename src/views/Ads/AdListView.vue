<template>
<v-container>
<v-row justify="center">
<v-col cols="12" sm="8" lg="6">
<h1 class="text--secondary mb-3 mt-3">Корзина</h1>
<v-card 
	class="elevation-10 mb-5"
	v-for="ad in myAds"
	:key="ad.id">

<v-row>
<v-col xs="4">
<v-img :src="ad.src" height="175px" 
cover></v-img>
</v-col>
<v-col xs="8">
<h2 class="text--primary">{{ ad.title
 }}</h2>
<p style="height: 85px; overflow: hidden;
 text-overflow: ellipsis;">{{ ad.desc 
}}</p>
<v-card-actions>
<v-spacer></v-spacer>
<v-btn color="primary" variant="text" :to="'/ad/' + ad.id">
Open
</v-btn>
</v-card-actions>
</v-col>
</v-row>
</v-card>
</v-col>
</v-row>

<v-col xs="8">
<h2 class="text--primary">{{  }}</h2>
<p style="height: 85px; overflow: hidden; text-overflow: ellipsis;">{{  }}</p>
<v-card-actions>
<v-spacer></v-spacer>
<v-btn color="primary" variant="text" :to="Open">
Open
</v-btn>
</v-card-actions>
</v-col>
</v-container>
</template>
<script>
export default {
	computed: {
	myAds(){
		return this.$store.getters.myAds
	}
	}

}
</script>