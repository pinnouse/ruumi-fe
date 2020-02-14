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
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    flex: 1;

    & > h1 {
        display: block;
        width: 100%;
        font-size: 125px;
        color: var(--theme-color);
        font-weight: bold;
        margin-bottom: 16px;
        border-bottom: 4px solid var(--theme-color);
    }
}
</style>