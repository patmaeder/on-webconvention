<template>
    <div>
        <h1>Hallo das ist die UI Test Seite</h1>
        <TestComponent></TestComponent>
        <ExpoName dateRange="15.05. - 10.06." expoName="Digitalisierungscamp"/>
        <BasicButton>Meeting erstellen</BasicButton>
        <BasicIcon size="medium" source="/icons/profile.svg"/>
        <BasicIcon size="medium" source="/icons/q.svg"/>
        <BasicIcon size="medium" source="/icons/settings.svg"/>
        <AgendaItem :favorite="true" currentOrNext="Aktuell" time="17:30" agendaItem="Programmpunkt"/>
        <AgendaItem :favorite="false" currentOrNext="Aktuell" time="17:30" agendaItem="Programmpunkt"/>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
    div {
        background: #252830;
        color: #FFFFFF;
    }
</style>