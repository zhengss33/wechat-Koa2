<template>
  <div class="header">
    <div class="menu">
      <span class="material-icon menu"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .header {
    height: 56px;
    width: 100%;
    box-shadow: 0 0 4px rgba(0, 0, 0, .14), 0 4p 8px rgba(0, 0, 0, .28);
    background-color: #ff6600;
    color: #fff;
    display: flex;
    align-items: center;

    .menu {
      cursor: pointer;
      margin-left: 20px;
      font-size: 26px;
    }
  }
</style>
