<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 700px; width: 80%">
      <div style="text-align: center">
        <div class="text-h4 text-primary text-weight-medium">
          Registerasi Sekarang!
        </div>
        <div class="text-subtitle1">Tolong isi form dibawah dengan benar.</div>
        <br />
      </div>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          v-model="name"
          label="Masukkan Nama Lengkap Anda"
          hint="Nama Lengkap"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Username tidak sesuai, silahkan coba lagi',
          ]"
        />
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

        <div>
          <q-btn label="Register" type="submit" color="primary" />
          <br />
          <div style="text-align: center">
            Sudah punya akun?
            <router-link
              to="/login"
              style="text-decoration: none"
              class="text-primary"
            >
              <b> Login </b>
            </router-link>
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import store from "../store.js";
  
export default {
  setup() {
    const $q = useQuasar();
    const id = ref(uuidv4());
    const name = ref(null);
    const username = ref(null);
    const password = ref(null);
    const router = useRouter();

    return {
      id,
      name,
      password,
      username,
      val: ref(false),
      passwordVisible: ref(false),

      onSubmit() {
        const hash = CryptoJS.SHA256(password.value).toString();
        const username_check = `SELECT username FROM users WHERE username = '${username.value}'`;

        const sql = `INSERT INTO users(id, fullname, username, password) VALUES ('${id.value}', '${name.value}', '${username.value}', '${hash}')`;
        axios
          .post("http://localhost:3000/register", {
            sql,
          })
          .then((response) => {
            console.log(response.data);
            if (response.data.status === 200) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Berhasil Register",
                timeout: 1000,
              });
              router.push("/login");
            } else {
              $q.notify({
                color: "negative",
                position: "top",
                message: "Username telah digunakan",
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
  mounted() {
    const router = useRouter();

    if (store.state.isLoggedIn) {
      router.push("/");
    }
  },
};
</script>
