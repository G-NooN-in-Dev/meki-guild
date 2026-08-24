import type { ChangelogEntry } from '@/features/updates/types/changelog.type'

/**
 * 사이트 업데이트 일지.
 * 새 버전은 배열 **앞쪽**에 추가합니다. (최신이 위로)
 */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
	{
		version: '1.5.0',
		date: '2026-08-24',
		sections: [
			{
				title: '길드 정보',
				items: [{ text: '데이터 갱신 - CSV 동기화 방식 적용' }]
			},
			{
				title: '정보/팁',
				items: [
					{ text: '토벌전 명중컷 · 제한시간 추가' },
					{ text: '보스 레이드 명중컷 · 보상 정보 추가' },
					{
						text: '성장 던전 정보',
						children: [
							{ text: '무기 던전 — 명중컷, 제한시간 추가' },
							{ text: '경험치 던전 — 명중컷, 처치 몬스터 수 추가' },
							{ text: '장비 던전 — 명중컷, 제한시간, 처치 몬스터 수 추가' },
							{ text: '용사의 수련장 — 명중컷 추가' },
							{ text: '강화 던전 — 명중컷, 주문의 흔적 보상 개수, 의문의 주문서 확률 추가' }
						]
					}
				]
			},
			{
				title: '공통',
				items: [{ text: '업데이트 일지 추가' }, { text: '탭 UI 애니메이션 개선' }]
			}
		]
	},
	{
		version: '1.4.3',
		date: '2026-08-17',
		sections: [
			{
				title: '길드 정보',
				items: [
					{
						text: '길드 정보',
						children: [{ text: '모바일 환경 UI 개선' }, { text: '대항전 — 길드 포인트·순위 정보 추가' }]
					},
					{ text: '툴바 — 모바일 환경 UI 개선' },
					{ text: '멤버 테이블 — 가독성 개선' }
				]
			},
			{
				title: '정보/팁',
				items: [
					{ text: '직업 출시 순서표 페이지 추가' },
					{
						text: '대항전 명중컷',
						children: [{ text: '모바일 UI 변경' }, { text: '실제 데이터 반영 및 규칙 추가' }]
					}
				]
			},
			{
				title: '공통',
				items: [{ text: 'BGM 자동재생 제거' }, { text: '테이블 UI 개선' }, { text: '모바일 breakpoint 변경' }]
			}
		]
	},
	{
		version: '1.4.2',
		date: '2026-08-13',
		sections: [
			{
				title: '정보/팁',
				items: [
					{ text: '신규 유물 3종 추가 — 레인디어의 창, 비밀 지도, 순환의 고리' },
					{ text: '유물 보유 효과 추가' },
					{ text: '유물 페이지 — 모바일 UI 개선' }
				]
			}
		]
	},
	{
		version: '1.4.1',
		date: '2026-08-12',
		summary: '길드 정보와 정보/팁 페이지를 분리했습니다.',
		hotfix: true,
		sections: [
			{
				title: '공통',
				items: [{ text: '길드 정보 · 정보/팁 구역 분리' }]
			}
		]
	},
	{
		version: '1.4.0',
		date: '2026-08-10',
		sections: [
			{
				title: '길드 정보',
				items: [{ text: '총 전투력 · 평균 레벨 정보 추가' }]
			},
			{
				title: '정보/팁',
				items: [
					{ text: '동료·유물 세팅을 컨설팅에서 정보로 변경' },
					{ text: '목록 카테고리 제거' },
					{ text: '용사의 발자취 보상 페이지 추가' }
				]
			},
			{
				title: '공통',
				items: [{ text: '모바일 환경 UI 개선' }]
			}
		]
	},
	{
		version: '1.3.1',
		date: '2026-08-04',
		sections: [
			{
				title: '길드 정보',
				items: [{ text: '증감 수치 부호 버그 수정' }, { text: '토벌전 — 길드 순위 추가, 등급표 UI 개선' }]
			},
			{
				title: '공통',
				items: [{ text: 'BGM 추가' }, { text: '내부 데이터 갱신 로직 개선' }]
			}
		]
	},
	{
		version: '1.3.0',
		date: '2026-08-01',
		sections: [
			{
				title: '정보/팁',
				items: [
					{ text: '컨텐츠별 스테이지 컷 추가' },
					{ text: '대항전 명중컷 · 버프 스택 추가' },
					{
						text: '목록 페이지',
						children: [{ text: '카테고리 그룹화' }, { text: '태그 필터링 추가' }]
					}
				]
			}
		]
	},
	{
		version: '1.2.1',
		date: '2026-07-28',
		sections: [
			{
				title: '길드 정보',
				items: [
					{ text: '길드원 직업 변경 이력 추가' },
					{
						text: '직업 분포',
						children: [{ text: '인원수 변화 추가' }, { text: 'UI 변경' }]
					}
				]
			},
			{
				title: '1 vs 1 비교',
				items: [{ text: '길드 내 등수 · 토벌전 등수 정보 추가' }]
			},
			{
				title: '정보/팁',
				items: [{ text: '세팅 보드 UI 버그 수정' }]
			}
		]
	},
	{
		version: '1.2.0',
		date: '2026-07-24',
		sections: [
			{
				title: '정보/팁',
				items: [{ text: '동료·유물 세팅을 정보에서 컨설팅으로 변경' }]
			}
		]
	},
	{
		version: '1.1.0',
		date: '2026-07-20',
		sections: [
			{
				title: '정보/팁',
				items: [{ text: '목록 페이지 추가' }, { text: '동료 세팅 페이지 추가' }, { text: '유물 세팅 페이지 추가' }]
			},
			{
				title: '길드 정보',
				items: [{ text: '금주의 길드원 다이얼로그 추가' }]
			},
			{
				title: '공통',
				items: [{ text: '신규 직업 정보 추가 — 윈드브레이커, 나이트워커' }]
			}
		]
	},
	{
		version: '1.0.1',
		date: '2026-07-16',
		sections: [
			{
				title: '길드 정보',
				items: [
					{ text: '길드원 상세 다이얼로그 추가' },
					{ text: '길드 내 순위 정보 추가' },
					{ text: '토벌전 — 길드 포인트 · 길드원 등수 추가' }
				]
			},
			{
				title: '공통',
				items: [{ text: '모바일 환경 UI 개선' }, { text: '대외용 비밀번호 검증 추가' }]
			}
		]
	},
	{
		version: '1.0.0',
		date: '2026-07-12',
		summary: '공식 배포',
		sections: [
			{
				title: '길드 정보',
				items: [{ text: '길드원 스펙 · 점수 정보' }, { text: '직업 분포' }, { text: '필터' }]
			},
			{
				title: '1 vs 1 비교',
				items: [{ text: '비교 페이지 추가' }]
			}
		]
	}
]

/** YYYY-MM-DD → 화면 표기(2026.08.19) */
function formatChangelogDate(date: string): string {
	const [year, month, day] = date.split('-')

	return `${year}.${month}.${day}`
}

export { formatChangelogDate }
