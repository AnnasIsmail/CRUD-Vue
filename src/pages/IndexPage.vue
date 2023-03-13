<template>
  <q-page class="flex justify-center">
    <div class="q-pa-md flex column" style="width: 85vw">
      <q-form
        @submit.prevent="addToDo"
        @reset="onReset"
        class="q-gutter-md"
        style="
          background-color: white;
          padding: 10px;
          padding-bottom: 15px;
          padding-top: 1px;
          margin-left: 0px;
          margin-top: 1px;
          border-radius: 10px;
        "
      >
        <div>
          <div>
            <div class="text-h5 text-primary">
              Hi, {{ uppercase(fullName) }}
            </div>
            <div class="text-subtitle1">
              What do I want to remind you what do you want to do?
            </div>
          </div>
        </div>

        <br />
        <q-input
          v-model="todo"
          label="What do you want to do? *"
          hint="example: lazy-lazyan"
          v-bind:id="idtodo"
          ref="todoInput"
        />
        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <!-- <q-btn label="Reset" type="reset" color="primary" class="q-ml-sm" /> -->
        </div>
      </q-form>
      <div class="q-pa-sm">
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </div>

      <q-list
        bordered
        separator
        class="bg-white"
        style="padding: 10px; border-radius: 10px"
        v-if="!loading"
      >
        <div
          class="q-pa-sm text-body1 text-center"
          v-if="list_todo.length === 0"
        >
          There is no todo list
        </div>
        <q-item v-for="(item, index) in list_todo" :key="item">
          <q-item-section>
            <q-item-label class="text-h6">{{ item.todo }}</q-item-label>

            <q-item-label caption
              >Created Date: {{ item.datetime }}</q-item-label
            >
            <q-item-label caption
              >Created By: {{ getUserName(item.iduser) }}</q-item-label
            >
            <q-item-label v-if="item.idlastedit" caption
              >Edited By: {{ getEditByName(item.idlastedit) }}</q-item-label
            >
            <q-item-label v-if="item.idlastedit" caption
              >Edited Date: {{ getEditDate(item.idlastedit) }}</q-item-label
            >
            <q-input v-if="item.edit" v-model="item.editText" />
            <q-item-label v-if="item.edit" caption
              >edited: {{ item.edited }}</q-item-label
            >
          </q-item-section>

          <div class="text-center items-center flex">
            <q-btn-dropdown
              color="primary"
              icon="history"
              style="
                margin-right: 10px;
                padding-left: 15px;
                padding-right: 15px;
              "
              v-if="item.idlastedit"
            >
              <q-list
                style="
                  width: 300px;
                  padding-left: 20px;
                  padding-right: 20px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                "
                v-for="dataHistory in getEditHistory(item.idtodo)"
                :key="dataHistory.id"
              >
                <q-item-label>{{ dataHistory.todo }}</q-item-label>
                <q-item-label caption
                  >Edited Date: {{ dataHistory.datetime }}</q-item-label
                >
                <q-item-label caption
                  >Edited By:
                  {{ getUserName(dataHistory.iduser) }}</q-item-label
                >
              </q-list>
            </q-btn-dropdown>

            <q-btn
              @click="editItem(index, item.todo)"
              color="warning"
              icon="edit"
              v-if="!item.edit"
              style="padding-left: 5px; padding-right: 5px"
            />
            <q-btn
              v-on:click="showPopup(index)"
              color="negative"
              icon="delete"
              v-if="!item.edit"
              style="margin-left: 10px; padding-left: 5px; padding-right: 5px"
            />
            <q-btn
              @click="saveEdit(item.idtodo, index)"
              color="primary"
              icon="check"
              v-if="item.edit"
              style="margin-left: 10px; padding-left: 5px; padding-right: 5px"
            />
          </div>

          <q-dialog v-model="item.remove" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="delete" color="negative" text-color="white" />
                <span class="q-ml-sm">Apakah kamu yakin?</span>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Ya"
                  color="negative"
                  @click="deleteItem(item.idtodo)"
                />
                <q-btn flat label="Tidak" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { inject } from "vue";
import { mapActions, mapGetters } from "vuex";
import { useRouter } from "vue-router";
import store from "../store.js";

export default {
  data() {
    return {
      list_todo: [],
      list_users: [],
      list_history: [],
      valueEdit: "",
      idtodo: uuidv4(),
      todo: "",
      name: "Unidentified User",
      confirm: false,
      fullName: "undefined",
      onEdit: false,
      loading: true,
    };
  },

  mounted() {
    const router = useRouter();

    if (store.state.isLoggedIn) {
      router.push("/");
    }
    axios
      .get("http://localhost:3000/get_todo")
      .then((response) => {
        this.loading = false;
        this.list_todo = this.sortedDates(response.data.todo);
        this.list_history = this.sortedDates(response.data.edit);
        this.list_users = response.data.users;
      })
      .catch((error) => {
        console.log(error);
      });

    if (this.fullName === "undefined") {
      const token = Cookies.get("token");
      axios
        .post("http://localhost:3000/get_user", { token })
        .then((response) => {
          if (response.data.status === 200) {
            this.fullName = response.data.data.fullname;
          } else {
            this.signOut();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  setup() {
    const $q = useQuasar();
    const name = ref(null);
    const stores = store;

    return {
      stores,
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

      // onReset() {
      //   name.value = null;
      // },
    };
  },
  computed: {
    ...mapGetters(["isUserLoggedIn", "user"]),
  },
  methods: {
    ...mapActions(["logoutUser"]),
    logout() {
      this.logoutUser();
      this.$router.push("/login");
    },
    uppercase(fullName) {
      // return fullName.toUpperCase();
      return this.fullName.charAt(0).toUpperCase() + this.fullName.slice(1);
    },

    sortedDates(param) {
      return param.sort((a, b) => dayjs(b.datetime).diff(dayjs(a.datetime)));
    },
    getUserName(param) {
      const user = this.list_users.find((data) => data.id === param);
      if (user !== undefined) {
        return user.fullname;
      } else {
        return param;
      }
    },
    getEditByName(param) {
      const history = this.list_history.find((data) => data.id === param);
      if (history !== undefined) {
        const user = this.list_users.find((data) => data.id === history.iduser);
        return user.fullname;
      } else {
        return param;
      }
    },
    getEditDate(param) {
      const history = this.list_history.find((data) => data.id === param);
      if (history !== undefined) {
        return history.datetime;
      } else {
        return param;
      }
    },
    getEditHistory(param) {
      const history = this.list_history.filter((data) => data.idtodo === param);
      if (history !== undefined) {
        return history;
      } else {
        return param;
      }
    },
    getTodo() {
      axios
        .get("http://localhost:3000/get_todo")
        .then((response) => {
          this.list_todo = this.sortedDates(response.data.todo);
          this.list_history = this.sortedDates(response.data.edit);
          this.list_users = response.data.users;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    showPopup(param) {
      this.list_todo[param].remove = true;
    },

    addToDo() {
      if (!this.todo) {
        // alert("Please enter a todo");
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Tolong masukan Todo",
          timeout: 1000,
        });
        return;
      }

      const idtodo = uuidv4();
      const todo = this.todo;
      const datTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const sql = `INSERT INTO todo(idtodo, todo, datetime, idlastedit, iduser) VALUES ('${idtodo}','${todo}','${datTime}','',`;
      const token = Cookies.get("token");
      axios
        .post("http://localhost:3000/add_todo", {
          sql,
          token,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 200) {
            this.todo = "";
            this.getTodo();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editItem(param, text) {
      if (this.onEdit !== false) {
        this.list_todo[this.onEdit].edit = false;
      }
      this.list_todo[param].editText = text;
      this.list_todo[param].edit = true;
      this.list_todo[param].edited = true;
      this.onEdit = param;
    },
    saveEdit(param, index) {
      const id = uuidv4();
      const todo = this.list_todo[index].editText;
      const datTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const sql = `UPDATE todo SET todo='${todo}',idlastedit='${id}' WHERE idtodo='${param}'`;
      const sql_edit = `INSERT INTO edit_todo(id, todo, datetime, idtodo, iduser) VALUES ('${id}','${todo}','${datTime}','${param}',`;
      const token = Cookies.get("token");
      if (todo !== this.list_todo[index].todo) {
        axios
          .post("http://localhost:3000/update_todo", {
            sql,
            sql_edit,
            token,
          })
          .then((response) => {
            if (response.data.status === 200) {
              this.list_todo[index].edit = false;
              this.list_todo[index].edited = false;
              this.getTodo();
              this.onEdit = false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.list_todo[index].edit = false;
      }
    },

    deleteItem(param) {
      const sql = `DELETE FROM todo WHERE idtodo='${param}'`;
      const token = Cookies.get("token");
      console.log(sql);
      axios
        .post("http://localhost:3000/delete_todo", {
          sql,
          token,
        })
        .then((response) => {
          if (response.data.status === 200) {
            this.confirm = false;
            this.getTodo();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
