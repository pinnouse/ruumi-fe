<template>
    <div class="error">
        <h1>{{error.statusCode}}</h1>
        <nuxt-link class="btn" to="/">Home Page</nuxt-link>
        <div>
            <span>{{error.message}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['error']
}
</script>

<style lang="scss">
#__layout > div > .error.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex: 1;
}
</style>