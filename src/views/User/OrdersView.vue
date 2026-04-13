<template>
<v-container>
<v-row justify="center">
<v-col cols="12" sm="8" lg="6">
<h1 class="text--secondary mb-3 mt-3">Заказы</h1>
<v-list subheader two-line flat>
<v-list-item v-for="order in orders" 
	:key="order.id">
<template v-slot:prepend>
<v-list-item-action>
<v-checkbox
:input-value="order.done"
color="primary"
@click="markDone(order)"
></v-checkbox>
</v-list-item-action>>
</template>
<v-list-item-title>{{ order.name }}</v-list-item-title>
<v-list-item-subtitle>{{ order.phone }}</v-list-item-subtitle>

<template v-slot:append>
<v-list-item-action>
    
<v-btn class="primary" :to="'/ad/' + order.adId">Open</v-btn>
</v-list-item-action>
</template>
</v-list-item>
</v-list>

</v-col>
</v-row>
</v-container>

</template>
<script>
export default{
    data(){
        return{
    orders: [
{
		id:"123",
		name:"Kostya",
		phone:"+7(978)000-00-05",
		adId:"1",
		done:true
	}
	]
}
},
methods: {
markDone(order) {
order.done = !order.done;
console.log(order.done);
},
},

}
</script>