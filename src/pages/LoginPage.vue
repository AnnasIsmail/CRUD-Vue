<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md"
      style="
        max-width: 700px;
        width: 80%;
        background-color: white;
        border-radius: 10px;
      "
    >
      <div style="text-align: center">
        <div class="text-h4 text-primary text-weight-medium">Login</div>
        <div class="text-subtitle1">
          Selamat datang di ToDo App, silahkan login untuk melanjutkan
        </div>
        <br />
      </div>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          v-model="username"
          label="Masukkan Username anda"
          hint="Username"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Username tidak sesuai, silahkan coba lagi',
          ]"
        />

        <q-input
          filled
          v-model="password"
          :type="passwordVisible ? 'text' : 'password'"
          label="Masukkan kata sandi anda"
          hint="Kata Sandi"
          :rules="[
            (val) => !!val || 'Password is required',
            (val) =>
              (val && val.length >= 8) ||
              'Password must be at least 8 characters',
            (val) =>
              /[A-Z]/.test(val) ||
              'Password must contain at least one uppercase letter',
            (val) =>
              /[a-z]/.test(val) ||
              'Password must contain at least one lowercase letter',
            (val) =>
              /\d/.test(val) || 'Password must contain at least one number',
          ]"
          class="q-mb-md"
        >
          <template #append>
            <q-icon
              :name="passwordVisible ? 'visibility' : 'visibility_off'"
              @click="passwordVisible = !passwordVisible"
              class="cursor-pointer"
            />
          </template>
        </q-input>

        <!-- <div class="q-pa-md" style="margin-top: 0px; margin-left: 0px">
          <q-checkbox v-model="val" label="Ingat saya" />
        </div> -->

        <div>
          <q-btn
            label="Log In"
            type="submit"
            :loading="loading"
            color="primary"
          />
          <br />
          <div style="text-align: center">
            Belum punya akun?
            <router-link
              to="/register"
              style="text-decoration: none"
              class="text-primary"
            >
              <b> Register </b>
            </router-link>
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

<script>
import { ref } from "vue";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import store from "../store.js";
export default {
  setup() {
    const $q = useQuasar();
    const username = ref(null);
    const password = ref(null);
    const errorMsg = ref(null);
    const router = useRouter();
    const loading = ref(false);
    return {
      username,
      password,
      val: ref(false),
      passwordVisible: ref(false),
      errorMsg,
      loading,
      onSubmit() {
        loading.value = true;
        const hash = CryptoJS.SHA256(password.value).toString();
        axios
          .post("http://localhost:3000/login", {
            username: username.value,
            password: hash,
          })
          .then((response) => {
            if (response.data.status === 200) {
              Cookies.set("token", response.data.token, {
                expires: 1,
              });
              store.commit("login");
              router.push("/");
            } else {
              $q.notify({
                color: "negative",
                position: "top",
                message: "Salah password atau username",
                timeout: 1000,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  },
  methods: {
    login() {
      this.$router.push("/");
    },
  },
  mounted() {
    const router = useRouter();

    if (store.state.isLoggedIn) {
      router.push("/");
    }
  },
  data() {
    return {
      // loading: false,
    };
  },
};
</script>
