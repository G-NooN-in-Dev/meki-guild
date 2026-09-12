# 무기 강화 계산기 — 조사 노트

> **상태:** 구현 전 참고용  
> **조사일:** 2026-09-12  
> **참고 페이지:** [메키픽 무기 강화 계산기](https://www.mekipick.com/calculator/weapon)  
> **수치 스냅샷:** [`weapon-upgrade-calculator.data.json`](./weapon-upgrade-calculator.data.json)

메키픽 해당 페이지를 기준으로 UI·데이터·계산 로직을 정리한 문서다.  
**구현 SSOT로 쓰기 전에 인게임/커뮤니티 수치와 교차 검증**할 것. 게임 패치로 값이 바뀔 수 있다.

---

## 1. 결론

| 항목                 | 화면만              | 클라이언트 JS            |
| -------------------- | ------------------- | ------------------------ |
| UI 구조·필드         | ✅                  | ✅                       |
| 소모 비용 테이블     | ❌ (0이면 0만 표시) | ✅ 등급×티어별 레벨 비용 |
| 보유/장착 효과 공식  | ❌                  | ✅                       |
| 전체 무기·비용 분석  | 결과 UI만           | ✅ 합산 로직             |
| 최적 가성비 알고리즘 | 결과 UI만           | ✅ greedy + 스왑 우선    |

계산 전용 API는 없고, **전부 프론트에서 계산**한다.

---

## 2. 페이지 UI 구조

### 2.1 무기 레벨 설정

- 무기를 **등급(에인션트 → …)** 단위로 묶어 카드 그리드 표시
- 카드당 입력
  - 현재 레벨
  - 목표 레벨
  - 최대 레벨 (`미획득`이면 입력 비활성)
- 카드당 표시
  - **소모 비용** (현재 → 목표 강화석 합)
  - **보유 효과** (%)
  - **장착 효과** (%)
- 액션: 장착 무기로 설정, 정렬(등급 높은순 등), 초기화
- 프리셋 저장/불러오기(로그인 시)

### 2.2 최적 가성비 계산

- 입력: 보유 무기 강화석, 잔여 재화 사용 여부
- 출력: 단계별 강화/장착 교체 추천, 총 소모·총 이득

### 2.3 전체 무기 분석

- 장착 공격력, 보유 공격력, 합계 공격력, 장착 명중, 장착 공속 등 합산 지표

### 2.4 전체 비용 분석

- 목표 레벨 기준 총 소모 비용 등

---

## 3. 데이터 모델

등급 `1~7`, 티어 `1~4` → 무기 28종.

| grade | 이름     |
| ----- | -------- |
| 1     | 노말     |
| 2     | 레어     |
| 3     | 에픽     |
| 4     | 유니크   |
| 5     | 레전드리 |
| 6     | 미스틱   |
| 7     | 에인션트 |

| tier | 이름   |
| ---- | ------ |
| 1    | 하급   |
| 2    | 중급   |
| 3    | 상급   |
| 4    | 최상급 |

표시명 예: `하급 에인션트` = grade 7 / tier 1  
id 예: `weapon-7-1`

### 3.1 무기 기본값 (`base`)

키: `"{grade}_{tier}"`  
값: `[equipBase, collectBase, hit, spd]`

| 의미           | 필드      | 비고                    |
| -------------- | --------- | ----------------------- |
| 장착 효과 계수 | `equip`   | 레벨 배율과 함께 % 계산 |
| 보유 효과 계수 | `collect` | 레벨 배율과 함께 % 계산 |
| 명중           | `hit`     | 레벨과 무관(고정)       |
| 공속           | `spd`     | 레벨과 무관(고정)       |

전체 표는 JSON의 `weapons[].base` 참고. 발췌:

| 무기            | equip  | collect | hit | spd |
| --------------- | ------ | ------- | --- | --- |
| 하급 노말       | 150    | 43      | 0   | 0   |
| 하급 에픽       | 764    | 218     | 4   | 2   |
| 최상급 미스틱   | 38106  | 9527    | 33  | 6   |
| 하급 에인션트   | 51443  | 12861   | 40  | 8   |
| 최상급 에인션트 | 126569 | 31642   | 55  | 8   |

### 3.2 레벨 배율 (`levelMultipliers`)

- 길이 201, 인덱스 = 레벨 (0번은 미사용, L1=1000 …)
- 최대 레벨 **200**
- 예: L1=1000, L10=1027, L50=1147, L100=1297

### 3.3 강화 비용 테이블 (`costTables`)

- 길이 28 (무기마다 `costTableIndex`로 매핑)
- 각 테이블 길이 200
- **`costTables[i][level - 1]`** = 레벨 `level` → `level+1` 에 필요한 강화석
- L200에서는 다음 단계 비용 0 (테이블 끝값이 0인 경우 있음)

---

## 4. 계산 공식

의사코드는 메키픽 번들 로직을 읽기 쉽게 풀어 쓴 것이다.

### 4.1 단일 레벨 스탯

```ts
function weaponStats(grade: number, tier: number, level: number) {
	if (level < 1 || level > 200) return null
	const { equip, collect, hit, spd } = base[`${grade}_${tier}`]
	const mult = levelMultipliers[level]

	return {
		equip: Math.floor((equip * mult) / 1000) / 10, // 장착 효과 %
		collect: Math.floor((collect * mult) / 1000) / 10, // 보유 효과 %
		hit, // 고정
		spd, // 고정
		costToNext: level >= 1 && level < 200 ? costTables[costTableIndex[`${grade}_${tier}`]][level - 1] : 0
	}
}
```

검증 샘플 (2026-09-12 스냅샷):

| 무기          | 레벨 | 장착%  | 보유%  | 다음 강화 비용 |
| ------------- | ---- | ------ | ------ | -------------- |
| 하급 에인션트 | 1    | 5144.3 | 1286.1 | 23520          |
| 하급 에인션트 | 10   | 5283.1 | 1320.8 | 25724          |
| 하급 에인션트 | 100  | 6672.1 | 1668   | 80629          |
| 최상급 미스틱 | 50   | 4370.7 | 1092.7 | 16546          |

### 4.2 구간 소모 비용 (현재 → 목표)

```ts
function rangeCost(grade, tier, fromLevel, toLevel) {
	if (toLevel <= fromLevel) return 0
	let sum = 0
	for (let lv = Math.max(1, fromLevel); lv < toLevel; lv++) {
		sum += weaponStats(grade, tier, lv).costToNext
	}
	return sum
}
```

카드의 **소모 비용** = `rangeCost(현재, 목표)`.

### 4.3 전체 무기 분석 (합산)

보유 무기들의 레벨을 기준으로:

- **보유 공격력(collect 합)** = 모든 무기의 `collect` 합
- **장착 공격력(equip)** = **장착 중인 무기 1개**의 `equip`만 사용
- 명중/공속도 장착 무기(또는 동일 규칙) 기준으로 합산 표시

메키픽 함수명 대응:

- `calculateWeaponStats(grade, tier, level)`
- `calculateRangeCost(grade, tier, from, to)`
- `calculateTotalCost(levelsByWeaponId, weapons)`
- `calculateTotalStats(levelsByWeaponId, weapons, mode)` — mode: current / target / goal

### 4.4 최적 가성비 (개요)

입력: 무기 목록, 현재 레벨, 최대 레벨(획득 상한), 예산(강화석), 장착 무기 id, `useLeftoverBudget`

루프 (예산 > 0, 최대 약 500 step):

1. 후보 = 아직 최대 레벨 미만인 무기들의 **+1강**
2. 비용이 예산 이내인 후보만
3. 이득:
   - `collectGain` = 다음 레벨 collect − 현재 collect (항상)
   - `equipGain` = 장착 중인 무기일 때만 다음 equip − 현재 equip
4. 기본 효율: `(equipGain + collectGain) / cost`
5. **상위 등급/티어 교체(스왑)** 가능하면 별도 후보:
   - 새 무기의 equip이 현재 장착 equip 이상이 되는 최소 레벨까지 강화 후 장착
   - 효율에 큰 우선 보너스 (`1e9 * (1000*grade + tier) + …` 형태)
6. 효율 최대 후보 1개 선택 → 레벨/장착/예산 갱신 → 반복

옵션:

- `잔여 재화 사용` off면, 상위 무기 우선·장착 관련 제약이 더 강해짐
- 장착 무기 미선택 시 계산 버튼 비활성/토스트

결과에 **break-even / breakthrough** 안내 문구(다른 무기 장착 전환 추천 등)도 포함된다.

---

## 5. 구현 시 제안 레이어 (미구현)

나중에 `apps/web`에 붙일 때 예시 분리:

```
features/calculator/weapon/
  types/
  data/          # JSON 또는 TS 상수 (검증 후 SSOT)
  lib/
    weapon-stats.ts      # 단일 스탯·구간 비용
    weapon-totals.ts     # 전체 분석 합산
    weapon-optimizer.ts  # 가성비 greedy
  components/
  sections/
```

UI는 `@shared/ui` 우선. 숫자 입력·카드 그리드는 기존 tips/calculator 패턴을 맞출 것.

---

## 6. 주의사항

1. **저작권·출처:** 메키픽 UI/카피/번들 코드를 그대로 복제하지 말 것. 수치·공식은 교차 검증 후 우리 데이터로 재구성.
2. **패치 민감:** 비용·배율·base는 밸런스 패치로 자주 바뀔 수 있음 → 데이터와 로직 분리.
3. **무기 목록 범위:** 메키픽은 가챠 테이블(예: floor `"18"`)에서 목록을 가져오는 흔적이 있음. 우리 앱은 “전체 28종” vs “획득 가능만”을 제품 결정으로 두면 됨.
4. **프리셋/계정 저장**은 메키픽 전용 기능. 초기 구현에서 제외해도 됨.

---

## 7. 관련 파일

| 파일                                                                           | 내용                                 |
| ------------------------------------------------------------------------------ | ------------------------------------ |
| [`weapon-upgrade-calculator.data.json`](./weapon-upgrade-calculator.data.json) | base, 배율, 비용 테이블, 샘플 스냅샷 |
| 이 문서                                                                        | UI·공식·알고리즘·구현 메모           |
