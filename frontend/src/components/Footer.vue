<template>
  <footer class="bg-gray-800 text-white p-4 mt-4">
    <div class="container mx-auto flex justify-between">
      <div class="space-y-2">
        <router-link to="/cgv" class="block hover:underline">CGV</router-link>
        <router-link to="/mentions-legales" class="block hover:underline">Mentions légales</router-link>
      </div>
      <div class="space-y-2">
        <router-link to="/auth/register" class="block hover:underline">S'inscrire</router-link>
        <router-link to="/auth/login" class="block hover:underline">Se connecter</router-link>
      </div>
      <div class="space-y-2">
        <router-link to="/produits" class="block hover:underline">Produits</router-link>
        <router-link to="/categories" class="block hover:underline">Catégories</router-link>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style scoped>
footer {
  background-color: #000;
  color: white;
  padding: 1rem;
  margin-top: 1rem;
}
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
