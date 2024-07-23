<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-4xl p-8 space-y-8 bg-white rounded shadow-md">
      <h1 class="text-4xl font-extrabold text-center text-gray-900">
        Bienvenue chez MECASCRAP
      </h1>
      <p class="text-center text-gray-600">
        Découvrez nos produits et services exceptionnels. Votre moto mérite le meilleur, c'est pour ça que vous êtes ici.
      </p>
      <div class="flex justify-center space-x-4">
        <router-link to="/produits" class="py-2 px-4 bg-black text-white font-semibold rounded-md shadow-sm hover:bg-gray-800">
          Voir les produits
        </router-link>
        <router-link to="/categories" class="py-2 px-4 bg-white text-black font-semibold border border-gray-300 rounded-md shadow-sm hover:bg-gray-100">
          Categories
        </router-link>
      </div>
      <div class="mt-8">
        <h2 class="text-2xl font-semibold text-gray-800">
          Nos Services
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900">Diversité</h3>
            <p class="mt-2 text-gray-600">Seulement les meilleures marques sur le marché</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900">Qualité</h3>
            <p class="mt-2 text-gray-600">Les produits de notre catalogue sont les plus qualitatifs que vous puissiez trouver</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900">Conseil</h3>
            <p class="mt-2 text-gray-600">Vous ne savez pas ce que vous voulez? Laissez nous vous aiguiller</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>

</style>
