<template>
    <div id="eventSite">
        <div id="eventSite__controls">
            <NuxtLink to="/" @click="leaveEvent">
                <div>
                    <span>
                        {{ `0${new Date(expo.startDate).getDate()}`.slice(-2) }}.{{ `0${new Date(expo.startDate).getMonth() + 1}`.slice(-2) }} -
                        {{ `0${new Date(expo.endDate).getDate()}`.slice(-2) }}.{{ `0${new Date(expo.endDate).getMonth() + 1}`.slice(-2) }}
                    </span>
                    <p>{{ expo.name }}</p>
                </div>
                <div>
                    <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.2129 9.18164L26.0002 13.7271L22.2129 9.18164ZM22.2129 18.2726L26.0002 13.7271L22.2129 18.2726Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 1V26.4548M23.7275 13.7274H11.9092H23.7275ZM1 1H17.3638H1ZM1 26.4548H17.3638H1ZM17.3638 1V8.27281V1ZM17.3638 19.182V26.4548V19.182Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </NuxtLink>

            <NuxtLink :to="`/room/${currentRoom}`" v-if="currentRoom != null">
                {{ eventSite.find(elem => elem.id == currentRoom).name }} <br />beitreten
            </NuxtLink>
        </div>
        <EventSiteRenderer 
            ref="eventSiteRenderer"
            :eventSite="eventSite" 
            :user="user" 
            :events="events" 
            :favorites="favoriteEvents" 
            @favorEvent="favor"
            @enterRoom="joinRoom" 
        />
        <Calendar :events="events" :favorites="favoriteEvents" @favorEvent="favor"/>
    </div>
</template>

<script lang="ts" setup>

const route = useRoute()

const user = {
    id: route.query.id,
    role: route.query.role
}

const expo = {
    id: 123456789,
    name: "Digitalisierungscamp",
    startDate: "2022-07-05T09:00:00",
    endDate: "2022-07-12T17:00:00"
}

const eventSite = [
   {
        id: 500000,
        name: 'Empfangsbereich',
        type: "lobby",
        src: "lobby.glb",
        position: {
            x: 0,
            y: 0,
            z: 0.5
        },
   },
   {
        id: 500001,
        name: 'Meetingraum 1',
        type: "keynote",
        src: "keynote.glb",
        position: {
            x: 1,
            y: 0,
            z: 0
        },
    }, 
    {
        id: 500002,
        name: 'Meetingraum 2',
        type: "keynote",
        src: "keynote.glb",
        position: {
            x: 1,
            y: 0,
            z: 1
        },
    }, 
    {
        id: 500003,
        name: 'Pausenraum',
        type: "break",
        src: "break.glb",
        position: {
            x: 0,
            y: 0,
            z: -1
        },
    },
]

const events = [
    {
        id: 100000,
        name: "Willkommen - Einführungsveranstaltung",
        startDate: "2022-07-05T10:00:00",
        endDate: "2022-07-05T11:00:00",
        description: "Dr. Peter Maier startet gemeinsam mit allen Teilnehmern in die Veranstaltung Digitalisierungscamp. In der Einführungsveranstaltung wird Ablauf der Veranstaltung vorgestellt. Außerdem findet zu Beginn eine Vorstellung aller wichtigen Themen statt, die während der Veranstaltung behandelt werden sollen.",
        room: 500001
    },
    {
        id: 100001,
        name: "5G-Workshop",
        startDate: "2022-07-05T13:00:00",
        endDate: "2022-07-05T15:00:00",
        description: "Die Vernetzung von Maschinen und Endgeräten schreitet ungebrochen voran. Eng damit verknüpft ist ein anhaltender Bedarf an Bandbreite, um die riesigen Datenmengen zu übertragen. Lte ist schon heute ausgeschöpft. Das Seminar erklärt die Zielsetzungen und die Umsetzung für 5G. 5G steht dabei für 5. Generation Mobilfunk. 5G soll nicht nur Menschen, sondern Allem (Maschinen, Autos, Messgeräten, etc.) die Möglichkeit zur Kommunikation bieten. Der Fokus liegt auf den Grundlagen der Technik, die in 5G verwendet werden. Das beinhaltet Air Interface (New Radio) genauso wie Modulationsarten, Stand der Technik und Kompatibilität zu anderen Standards.",
        room: 500001
    },
    {
        id: 100002,
        name: "Java Programmierung für Anfänger",
        startDate: "2022-07-05T13:00:00",
        endDate: "2022-07-05T15:00:00",
        description: "Durch die rasante Entwicklung der IT-Technologien steigt die Nachfrage nach neuer Software und IT-Fachkräften mit entsprechenden Programmierkenntnissen. JAVA gehört zu der international bekanntesten und am meisten verwendeten Programmiersprache.In diesem Live-Online-Seminar erlernen Sie die Grundkenntnisse der JAVA Programmierung, um plattformübergreifende Softwareprogramme wie Android-Betriebssystem, Webanwendungen und Datenbanken programmieren zu können.",
        room: 500002
    },
    {
        id: 100003,
        name: "IPv6 - das neue Internetprotokoll",
        startDate: "2022-07-06T11:00:00",
        endDate: "2022-07-06T13:00:00",
        description: "Das bisher im TCP/IP-Internet verwendete zentrale Netzwerkprotokoll IPv4 (Internetwork Protocol version 4, RFC 791) mit seinen Hilfsprotokollen ICMP und ARP ist heute mehr als 30 Jahre alt und genügt als EDV-Methusalem nicht mehr den Anforderungen an das moderne Internet. Daher wurde ab 1995 der Nachfolger IPv6 (RFC 2460) entwickelt, der heute für alle modernen Betriebssysteme (Windows, UNIX) verfügbar ist und IPv4 im Feld ersetzen wird.",
        room: 500002
    },
    {
        id: 100004,
        name: "Effektive Arbeitsvorbereitung",
        startDate: "2022-07-07T09:00:00",
        endDate: "2022-07-07T11:00:00",
        description: "Die Kunden wollen immer schneller, in kürzerer Zeit termintreu beliefert werden. Eine effektive Planung und Steuerung ist somit unabdingbar. Die Arbeitsvorbereitung muss in der Lage sein die Material- und Kapazitätsplanung, die Produktion, die Auftragsfeinplanung so terminlich aufeinander abzustimmen, dass mit minimiertem Working Capital die richtigen Produkte kostenoptimiert gefertigt, die Kundenaufträge pünktlich, zum gewünschten Termin geliefert werden.",
        room: 500001
    },
    {
        id: 100005,
        name: "JAVA Programmierung für Fortgeschrittene",
        startDate: "2022-07-07T09:00:00",
        endDate: "2022-07-07T11:00:00",
        description: "Durch die rasante Entwicklung der IT-Technologien steigt die Nachfrage nach neuer Software und der IT-Fachkräfte mit entsprechenden Programmierkenntnissen. JAVA gehört zu der international bekanntesten und am meisten verwendeten Programmiersprache. In diesem Live-online Seminar wird die korrekte Anwendung von objektorientierter Programmierung, dazugehörigen Patterns sowie generischen Elementen erlernt. Ein weiterer Fokus liegt auf testgetriebener Entwicklung und der damit verbundenen Verbesserung der Code- und Softwarequalität.",
        room: 500002
    }
]

let favoriteEvents = ref([]);

let currentRoom = ref(null);

const eventSiteRenderer = ref(null);

function favor(eventID) {

    if (favoriteEvents.value.includes(eventID)) {
        favoriteEvents.value = favoriteEvents.value.filter((elem) => {
            return elem != eventID
        })

    } else {
        favoriteEvents.value.push(eventID)
    }
}

function joinRoom(roomID) {

    currentRoom.value = null;

    if (roomID != null) {
        const roomType = eventSite.find(elem => elem.id == roomID).type;

        if (roomType == "keynote") {
            const currentTimestamp = new Date().getTime()

            let filteredEvents = events.filter((elem) => {
                return elem.room == roomID &&
                    new Date(elem.endDate).getTime() > currentTimestamp &&
                    new Date(elem.startDate).getTime() < currentTimestamp
            });

            filteredEvents.length > 0 ? currentRoom.value = roomID : null;

        } else if (roomType == "break") {
            currentRoom.value = roomID
        }
    }
}

function leaveEvent() {
    eventSiteRenderer.value.removeCharacter();
    useRouter().push('/')
}
</script>

<style lang="scss">
#eventSite {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #252830;

    &__controls {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        gap: 12px;
        padding: 26px;
        z-index: 10;

        & > a {
            padding: 18px 26px;
            border: none;
            border-radius: 10px;
            box-shadow: 2px 4px 4px rgba(0, 0, 0, .25);
            cursor: pointer;
            text-decoration: none;
        }
    
        & > a:first-child {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: clamp(360px, 30vw, 460px);
            background-color: #363A45;


            & div:first-child {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                color: #ffffff;

                & p {
                    margin: 0;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                & span {
                    margin-bottom: 6px;
                    font-weight: 400;
                    font-size: .9rem;
                }
            }
        }

        & > a:nth-child(2) {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 160px;
            background: linear-gradient(150deg, rgba(121,220,240,1) 0%, rgba(59,86,149,1) 100%);
            font-size: 1rem;
            font-weight: 600;
            line-height: 120%;
            color: #ffffff;
            text-align: center;
        }
    }
}
</style>