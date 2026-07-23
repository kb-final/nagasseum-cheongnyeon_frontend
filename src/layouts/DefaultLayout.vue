<script setup></script>

<template>
  <div class="default-layout">
    <header class="default-layout__header">
      <!-- Header -->
    </header>
    <div class="default-layout__body">
      <aside class="default-layout__sidebar">
        <!-- Sidebar -->
      </aside>
      <main class="default-layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.default-layout__body {
  display: flex;
  flex: 1;
}

.default-layout__sidebar {
  width: 240px;
  flex-shrink: 0;
}

.default-layout__content {
  flex: 1;
  padding: 24px;
}
</style>
