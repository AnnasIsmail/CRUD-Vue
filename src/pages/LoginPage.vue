<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 700px; width: 80%">
      <div style="text-align: center">
        <div class="text-h4 text-primary">Login</div>
        <div class="text-subtitle1">
          Tolong isi form dibawah untuk melanjutkan.
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

        <div class="q-pa-md" style="margin-top: 0px; margin-left: 0px">
          <q-checkbox v-model="val" label="Ingat saya" />
        </div>
        <div>
          <q-btn label="Log In" type="submit" color="primary" />
          <br />
          <div style="text-align: center">
            Belum punya akun?
            <router-link
              to="/register"
              style="text-decoration: none"
              class="text-primary"
            >
              <!-- <q-btn
                class="reg-btn"
                flat
                color="primary"
                label="Register"
                no-hover
              /> -->
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
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const name = ref(null);
    const password = ref(null);
    const accept = ref(false);
    return {
      name,
      password,
      // passwordVisible: false,
      accept,
      val: ref(false),
      passwordVisible: ref(false),
      methods: {},

      onSubmit() {
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
    };
  },
};
</script>
