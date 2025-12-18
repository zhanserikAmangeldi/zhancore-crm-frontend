<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-light relative overflow-hidden">
    <div class="absolute -top-24 -left-24 w-80 h-80 bg-brand-indigo/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl"></div>

    <div class="z-10 text-center px-6">
      <p class="text-sm uppercase tracking-[0.35em] text-brand-indigo/70">404</p>
      <h1 class="mt-3 text-3xl sm:text-4xl font-semibold text-gray-900">Page not found</h1>
      <p class="mt-3 text-gray-500">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <RouterLink
          to="/login"
          class="inline-flex items-center justify-center rounded-xl bg-brand-indigo px-5 py-2.5 text-white text-sm font-medium shadow hover:bg-brand-indigo/90 transition"
        >
          Go to login
        </RouterLink>
      </div>
    </div>
  </div>
</template>
