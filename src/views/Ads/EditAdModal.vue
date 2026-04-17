<template>
  <v-dialog v-model="modal" max-width="500">
    <!-- 🔹 17.1. Активатор диалога (кнопка Edit) -->
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        color="warning"
        prepend-icon="mdi-pencil"
        variant="tonal"
      >
        Edit
      </v-btn>
    </template>

    <v-card class="pa-3">
      <v-row justify="center">
        <v-col cols="12">
          <v-card-title>
            <h2 class="text-h6 text-primary">Edit Ad</h2>
          </v-card-title>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12">
          <v-card-text>
            <!-- 🔹 17.3. Поля редактирования -->
            <v-text-field
              name="title"
              label="Title"
              v-model="editedTitle"
              :rules="[v => !!v || 'Title is required']"
              prepend-icon="mdi-format-title"
            ></v-text-field>
            
            <v-textarea
              name="desc"
              label="Description"
              v-model="editedDesc"
              :rules="[v => !!v || 'Description is required']"
              class="mb-3"
              prepend-icon="mdi-text-box-edit"
              rows="4"
            ></v-textarea>
          </v-card-text>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12">
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- 🔹 17.4. Кнопки отмены и сохранения -->
            <v-btn variant="text" @click="onCancel" :disabled="globalLoading">Cancel</v-btn>
            <v-btn 
              color="success" 
              @click="onSave"
              :disabled="!editedTitle || !editedDesc || globalLoading"
              :loading="globalLoading"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['ad'],
  
  data() {
    return {
      modal: false,
      editedTitle: "",
      editedDesc: ""
    }
  },

  computed: {
    globalLoading() {
      return this.$store.getters['shared/loading']
    }
  },

  watch: {
    // 🔹 Сброс/обновление полей при каждом открытии окна
    modal(newVal) {
      if (newVal && this.ad) {
        this.editedTitle = this.ad.title
        this.editedDesc = this.ad.desc
      }
    }
  },

  methods: {
    // 🔹 17.4. Отмена изменений
    onCancel() {
      this.editedTitle = this.ad?.title || ""
      this.editedDesc = this.ad?.desc || ""
      this.modal = false
    },
    
    // 🔹 17.4. Сохранение с валидацией и dispatch
    onSave() {
      if (this.editedTitle && this.editedDesc) {
        this.$store.dispatch('ads/updateAd', {
          id: this.ad.id,
          title: this.editedTitle,
          desc: this.editedDesc
        }).finally(() => {
          this.modal = false
        })
      }
    }
  }
}
</script>