<template>
    <q-page>
        <div class="page-wrapper">
            <NavBar />
            <HeroSection id="hero" />
            <CountdownSection id="countdown" />
            <EventDetailsSection id="details" />
            <AttendeesSection id="attendees" />
            <BringListSection id="bringlist" />
            <GamesSection id="games" />
            <TimelineSection id="timeline" />
            <MoodSection id="mood" />
            <FooterSection id="footer" />
        </div>
    </q-page>
</template>

<script setup>
import AttendeesSection from 'components/AttendeesSection.vue'
import BringListSection from 'components/BringListSection.vue'
import CountdownSection from 'components/CountdownSection.vue'
import EventDetailsSection from 'components/EventDetailsSection.vue'
import FooterSection from 'components/FooterSection.vue'
import GamesSection from 'components/GamesSection.vue'
import HeroSection from 'components/HeroSection.vue'
import MoodSection from 'components/MoodSection.vue'
import NavBar from 'components/NavBar.vue'
import TimelineSection from 'components/TimelineSection.vue'
</script>
