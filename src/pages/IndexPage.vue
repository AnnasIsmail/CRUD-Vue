<template>
  <q-page class="flex justify-center">
    <div class="q-pa-md" style="width: 85vw">
      <q-form @submit.prevent="addToDo" @reset="onReset" class="q-gutter-md">
        <q-input
          v-model="name"
          label="What do you want to do? *"
          hint="example: lazy-lazyan"
        />
        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" class="q-ml-sm" />
        </div>
      </q-form>

      <div class="q-pa-md">
        <q-list bordered separator>
          <q-item v-for="(item, index) in Todo" :key="item">
            <q-item-section>
              <q-item-label>{{ item.todo }}</q-item-label>
              <q-item-label v-if="!item.edit" caption>{{
                item.dateTime
              }}</q-item-label>
              <q-input v-else v-model="valueEdit" />
              <q-item-label v-if="item.edited" caption
                >edited: {{ item.edited }}</q-item-label
              >
            </q-item-section>

            <div class="text-center">
              <!-- <q-icon clickable name="edit" color="teal" size="25px" /> -->
              <q-btn
                @click="editItem(index, item.todo)"
                color="primary"
                icon="edit"
                v-if="!item.edit"
                style="padding-left: 5px; padding-right: 5px"
              />
              <q-btn
                @click="deleteItem(index)"
                color="negative"
                icon="delete"
                v-if="!item.edit"
                style="margin-left: 10px; padding-left: 5px; padding-right: 5px"
              />
              <q-btn
                @click="saveEdit(index)"
                color="primary"
                icon="check"
                v-if="item.edit"
                style="margin-left: 10px; padding-left: 5px; padding-right: 5px"
              />
            </div>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  data() {
    return {
      Todo: JSON.parse(localStorage.getItem("Todo")),
      valueEdit: "",
    };
  },

  mounted() {
    if (JSON.parse(localStorage.getItem("Todo")) === null) {
      localStorage.setItem("Todo", JSON.stringify([]));
    }
  },

  setup() {
    const $q = useQuasar();
    const name = ref(null);

    return {
      name,

      onSubmit() {
        Todo.push(name.value);

        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first",
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted",
          });
        }
      },

      onReset() {
        name.value = null;
      },
    };
  },

  methods: {
    addToDo() {
      const today = new Date();
      const date = today.toLocaleDateString();
      const time = today.toLocaleTimeString();

      if (this.name !== "" && this.name !== null) {
        this.Todo.push({
          todo: this.name,
          dateTime: `${date} ${time}`,
          edit: false,
          edited: false,
        });
        localStorage.setItem("Todo", JSON.stringify(this.Todo));
        this.name = null;
      }
    },
    editItem(param, text) {
      this.valueEdit = text;
      this.Todo[param].edit = true;
    },
    saveEdit(param) {
      const today = new Date();
      const date = today.toLocaleDateString();
      const time = today.toLocaleTimeString();

      this.Todo[param].todo = this.valueEdit;
      this.Todo[param].edit = false;
      this.Todo[param].edited = `${date} ${time}`;
      localStorage.setItem("Todo", JSON.stringify(this.Todo));
    },
    deleteItem(param) {
      this.Todo.splice(param, 1);
      localStorage.setItem("Todo", JSON.stringify(this.Todo));
    },
  },

  // computed: {
  //   mappedData() {
  //     return this.arrayData.map((item) => item);
  //   },
  // },
};
</script>
