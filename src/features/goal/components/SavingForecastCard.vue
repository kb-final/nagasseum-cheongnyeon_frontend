<script setup>
import { computed } from 'vue'

import BaseButton from '@/shared/components/atoms/base/button/BaseButton.vue'
import { formatManwon, formatYearMonthKo } from '@/shared/utils/formatter'

import runnerImage from '@/assets/images/runner.png'
import flagImage from '@/assets/images/flag.png'

const props = defineProps({
  // savingStatus { fixedSaving, recentAverageSaving, latestSaving } — 저축 기록이 부족하면 평균/최근 값이 없을 수 있다.
  savingStatus: { type: Object, required: true },
  // forecasts [{ basis, monthlySaving, expectedDate, monthsDiff }] — 기준별로 항목이 빠질 수 있다.
  forecasts: { type: Array, required: true },
  targetDate: { type: String, required: true },
})

defineEmits(['change-saving'])

const FORECAST_LABELS = {
  FIXED: '기존 예상 달성일 (고정 저축 기준)',
  RECENT_AVERAGE: '최근 3개월 평균 기준',
  LATEST: '최근 저축 기준',
}

// 저축 현황 막대의 눈금 상한. 세 기준 중 가장 큰 값에 여유를 둬서 마커가 끝에 붙지 않게 한다.
const SCALE_HEADROOM = 1.15

const scaleMax = computed(() => {
  const values = [
    props.savingStatus.fixedSaving,
    props.savingStatus.recentAverageSaving,
    props.savingStatus.latestSaving,
  ].filter((value) => typeof value === 'number')

  return Math.max(...values, 1) * SCALE_HEADROOM
})

function toPercent(amount) {
  if (typeof amount !== 'number') return null
  return Math.min((amount / scaleMax.value) * 100, 100)
}

// 고정 저축액이 저축 현황 막대의 "목표선"(깃발)이고, 실제 저축액(최근/평균)이 그 선을 향해 채워진다.
const fixedPercent = computed(() => toPercent(props.savingStatus.fixedSaving))
const averagePercent = computed(() => toPercent(props.savingStatus.recentAverageSaving))
const latestPercent = computed(() => toPercent(props.savingStatus.latestSaving))

function forecastNote(forecast) {
  if (forecast.basis === 'FIXED' || !forecast.monthsDiff) return ''
  return forecast.monthsDiff > 0
    ? `예상 달성일이 ${forecast.monthsDiff}개월 앞당겨졌어요`
    : `예상 달성일이 ${-forecast.monthsDiff}개월 늦어졌어요`
}
</script>

<template>
  <section class="saving-forecast-card">
    <h2 class="saving-forecast-card__title">목표 시점 대비 예상 달성 시점</h2>

    <dl class="saving-forecast-card__status">
      <div class="saving-forecast-card__status-row">
        <dt>목표 시점</dt>
        <dd>{{ formatYearMonthKo(targetDate) }}</dd>
      </div>
      <div class="saving-forecast-card__status-row">
        <dt>고정 저축액</dt>
        <dd>{{ formatManwon(savingStatus.fixedSaving) }}</dd>
      </div>
      <div
        v-if="typeof savingStatus.recentAverageSaving === 'number'"
        class="saving-forecast-card__status-row"
      >
        <dt>최근 3개월 평균</dt>
        <dd class="saving-forecast-card__status-value--average">
          {{ formatManwon(savingStatus.recentAverageSaving) }}
        </dd>
      </div>
      <div
        v-if="typeof savingStatus.latestSaving === 'number'"
        class="saving-forecast-card__status-row"
      >
        <dt>최근 저축액</dt>
        <dd class="saving-forecast-card__status-value--latest">
          {{ formatManwon(savingStatus.latestSaving) }}
        </dd>
      </div>
    </dl>

    <div class="saving-forecast-card__gauge">
      <div class="saving-forecast-card__track">
        <span
          v-if="latestPercent !== null"
          class="saving-forecast-card__fill"
          :style="{ width: `${latestPercent}%` }"
        />
        <!-- 최근 저축액: 채워진 막대 끝에 선 등반가 + 머리 위 금액 -->
        <span
          v-if="latestPercent !== null"
          class="saving-forecast-card__latest-label"
          :style="{ left: `${latestPercent}%` }"
        >
          {{ formatManwon(savingStatus.latestSaving) }}
        </span>
        <span
          v-if="latestPercent !== null"
          class="saving-forecast-card__runner"
          :style="{ left: `${latestPercent}%` }"
        >
          <img :src="runnerImage" alt="" />
        </span>
        <!-- 최근 3개월 평균: 막대보다 조금 큰 사각형 마커 + 아래 금액 -->
        <span
          v-if="averagePercent !== null"
          class="saving-forecast-card__average-marker"
          :style="{ left: `${averagePercent}%` }"
        />
        <span
          v-if="averagePercent !== null"
          class="saving-forecast-card__average-label"
          :style="{ left: `${averagePercent}%` }"
        >
          {{ formatManwon(savingStatus.recentAverageSaving) }}
        </span>
        <span class="saving-forecast-card__flag" :style="{ left: `${fixedPercent}%` }">
          <img :src="flagImage" alt="" />
        </span>
        <span class="saving-forecast-card__flag-label" :style="{ left: `${fixedPercent}%` }">
          목표
        </span>
      </div>
    </div>

    <ul class="saving-forecast-card__forecasts">
      <li
        v-for="forecast in forecasts"
        :key="forecast.basis"
        class="saving-forecast-card__forecast"
      >
        <div class="saving-forecast-card__forecast-main">
          <span class="saving-forecast-card__forecast-label">
            {{ FORECAST_LABELS[forecast.basis] ?? forecast.basis }}
          </span>
          <!-- 남은 금액이 0이면 expectedDate가 null로 내려온다(달성 상태) -->
          <span class="saving-forecast-card__forecast-date">
            {{ forecast.expectedDate ? formatYearMonthKo(forecast.expectedDate) : '달성 완료' }}
          </span>
        </div>
        <p v-if="forecastNote(forecast)" class="saving-forecast-card__forecast-note">
          {{ forecastNote(forecast) }}
        </p>
      </li>
    </ul>

    <BaseButton variant="highlight" @click="$emit('change-saving')">월 저축액 변경하기</BaseButton>
  </section>
</template>

<style scoped>
.saving-forecast-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border, #262626);
  border-radius: 16px;
  background: #272727;
}

.saving-forecast-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--accent, #e3ffe8);
}

.saving-forecast-card__status {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--color-card-highlight, #f7ffd1);
}

.saving-forecast-card__status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.saving-forecast-card__status-row dt {
  color: #3f3f3f;
}

.saving-forecast-card__status-row dd {
  margin: 0;
  color: #727272;
}

.saving-forecast-card__status-value--average {
  color: #29d23a;
}

.saving-forecast-card__status-value--latest {
  color: #237f33;
}

.saving-forecast-card__gauge {
  padding: 44px 8px 20px;
}

.saving-forecast-card__track {
  position: relative;
  height: 6px;
  background: #243624;
}

.saving-forecast-card__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #9fd8ab;
}

.saving-forecast-card__runner {
  position: absolute;
  bottom: -6px;
  width: 28px;
  height: 28px;
  transform: translateX(-50%);
}

/* 진행바(6px)보다 세로로 조금 더 큰 마커 */
.saving-forecast-card__average-marker {
  position: absolute;
  top: -4px;
  width: 12px;
  height: 14px;
  border: 1px solid rgba(16, 19, 15, 0.14);
  background: #9fd8ab;
  transform: translateX(-50%);
}

.saving-forecast-card__runner img,
.saving-forecast-card__flag img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.saving-forecast-card__flag {
  position: absolute;
  bottom: 2px;
  width: 20px;
  height: 20px;
  transform: translateX(-50%);
}

.saving-forecast-card__latest-label,
.saving-forecast-card__average-label,
.saving-forecast-card__flag-label {
  position: absolute;
  font-size: 9px;
  white-space: nowrap;
  transform: translateX(-50%);
}

/* 등반가 머리 위에 오도록 마커(28px) 높이만큼 띄운다 */
.saving-forecast-card__latest-label {
  top: -34px;
  color: #ffd939;
}

.saving-forecast-card__average-label,
.saving-forecast-card__flag-label {
  top: 16px;
  color: #888888;
}

.saving-forecast-card__forecasts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.saving-forecast-card__forecast-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.saving-forecast-card__forecast-label {
  font-size: 12px;
  color: #999999;
}

.saving-forecast-card__forecast-date {
  font-size: 13px;
  color: #f5f5f5;
}

.saving-forecast-card__forecast-note {
  margin: 2px 0 0;
  font-size: 11px;
  color: #7fe3a0;
  text-align: right;
}
</style>
