<template>
    <div>
        <h1>{{error.statusCode}}</h1>
        <nuxt-link to="/">Home Page</nuxt-link>
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