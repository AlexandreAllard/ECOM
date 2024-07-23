<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex justify-between items-center">
    <p>
      Nous utilisons des cookies essentiels à la navigation, aucune information n'est recueillie à votre insu et nous ne partageons vos données avec personne.
    </p>
    <div class="flex space-x-4">
      <button @click="acceptCookies" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        J'accepte
      </button>
      <button @click="declineCookies" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Je refuse
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'CookieBanner',
  setup() {
    const showBanner = ref(false);

    const checkCookieConsent = () => {
      if (!localStorage.getItem('cookiesAccepted')) {
        showBanner.value = true;
      }
    };

    const acceptCookies = () => {
      localStorage.setItem('cookiesAccepted', 'true');
      showBanner.value = false;
    };

    const declineCookies = () => {
      window.location.href = 'https://www.google.com';
    };

    onMounted(() => {
      checkCookieConsent();
    });

    return {
      showBanner,
      acceptCookies,
      declineCookies
    };
  }
};
</script>

<style scoped>
.fixed {
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #1a202c;
  color: white;
  padding: 1rem;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: bold;
}
button.bg-green-500 {
  background-color: #48bb78;
}
button.bg-green-500:hover {
  background-color: #38a169;
}
button.bg-red-500 {
  background-color: #f56565;
}
button.bg-red-500:hover {
  background-color: #e53e3e;
}
</style>
