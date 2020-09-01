<template>
    <transition name="fade" mode="out-in">
        <router-view></router-view>
    </transition>
</template>

<script>
export default {
    name: "app",
    data() {
        return {};
    },
    methods: {},
    mounted() {},
    beforeDestroy() {},
};
</script>

<style lang="less" scoped>
</style>