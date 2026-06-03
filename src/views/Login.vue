<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Left side (Image / brand section) -->
      <div class="login-image-side">
        <div class="image-overlay"></div>
        <img src="/img/5017953.jpg" alt="Login Illustration" class="brand-illustration" />
        <div class="brand-caption">
          <h3>Factory Regulatory Software</h3>
        </div>
      </div>

      <!-- Right side (Login form section) -->
      <div class="login-form-side">
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loader"></div>
        </div>

        <div class="form-wrapper">
          <img src="/src/assets/images/logo.png" class="brand-logo" alt="logo" />
          <h2 class="welcome-text">Welcome back</h2>
          <h1 class="title-text">Factory Regulatory Software</h1>
          <p class="subtitle-text">Please sign in to continue</p>

          <a-form
            v-if="!isLoading"
            @finish="handleLogin(data, $router)"
            :model="data"
            class="login-form"
            layout="vertical"
          >
            <label class="field-label">User ID</label>
            <a-input
              v-model:value="data.user_id"
              placeholder="Enter your User ID"
              class="modern-input"
              size="large"
            />

            <label class="field-label">Password</label>
            <a-input-password
              v-model:value="data.password"
              id="password"
              placeholder="Enter your password"
              class="modern-input"
              size="large"
            />

            <a href="#" class="forgot-link">Forgot password?</a>

            <a-form-item>
              <a-button :loading="isLoading" htmlType="submit" block class="login-button">
                Sign In
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useLoginStore } from "../stores/login.js";
import { storeToRefs } from "pinia";

const loginStore = useLoginStore();
const { handleLogin } = loginStore;

const { isLoading } = storeToRefs(loginStore);

const data = reactive({
  user_id: "",
  password: "",
});
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e6f4ef 0%, #d8ece4 40%, #eef7f3 100%);
}

.login-card {
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px -15px rgba(0, 106, 78, 0.25);
}

/* ---------- Left / image side ---------- */
.login-image-side {
  position: relative;
  display: none;
  width: 50%;
  background: linear-gradient(160deg, #002f23 0%, #02271d 100%);
  overflow: hidden;
}

@media (min-width: 768px) {
  .login-image-side {
    display: flex;
  }
}

.brand-illustration {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 2.5rem;
}

.image-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.brand-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.5rem;
  z-index: 2;
  color: #ffffff;
}

.brand-caption h3 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.brand-caption p {
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.4;
}

/* ---------- Right / form side ---------- */
.login-form-side {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 3rem 2rem;
}

@media (min-width: 768px) {
  .login-form-side {
    width: 50%;
    padding: 3rem 3.5rem;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-logo {
  width: 60px;
  margin-bottom: 1.5rem;
}

.welcome-text {
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.02em;
}

.title-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #002f23;
  text-align: center;
  margin-top: 0.25rem;
}

.subtitle-text {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.login-form {
  width: 100%;
}

.field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
  letter-spacing: 0.01em;
}

.modern-input {
  margin-bottom: 1.1rem;
  border-radius: 12px;
}

.forgot-link {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: #002f23;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #00543e;
}

.login-button {
  width: 100% !important;
  height: 3rem !important;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #002f23 0%, #02271d 100%);
  color: #ffffff !important;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 20px -8px rgba(0, 47, 35, 0.6);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 26px -8px rgba(0, 47, 35, 0.7);
}

/* ---------- Modern input field styling (Ant Design overrides) ---------- */
.modern-input :deep(.ant-input),
.modern-input :deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
  /* border: 1.5px solid #e5e7eb; */
  padding: 0.6rem 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #f9fafb;
}

.modern-input :deep(.ant-input:hover),
.modern-input :deep(.ant-input-affix-wrapper:hover) {
  border-color: #6ec3a8;
}

.modern-input :deep(.ant-input:focus),
.modern-input :deep(.ant-input-affix-wrapper-focused) {
  border-color: #002f23;
  box-shadow: 0 0 0 3px rgba(0, 47, 35, 0.15);
  background: #ffffff;
}

/* ---------- Loading overlay ---------- */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loader {
  border: 6px solid rgba(0, 47, 35, 0.2);
  border-top: 6px solid #002f23;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
