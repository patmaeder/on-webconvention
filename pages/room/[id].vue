<template>
    <div>
        <div id="sidebar">
            <Chat :roomID="roomID" :user="user" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const roomID = route.params.id;
const user = {
    role: route.query.role,
    name: route.query.name,
}
</script>

<style>
#sidebar {
    height: 50vh;
    padding: 40px;
    background-color: #363A45;
}
</style>