import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const dataDirectory = join(scriptDirectory, '../apps/web/data')
const currentWeekPath = join(dataDirectory, 'current-week.json')
const previousWeekPath = join(dataDirectory, 'previous-week.json')

copyFileSync(currentWeekPath, previousWeekPath)

const currentWeek = JSON.parse(readFileSync(currentWeekPath, 'utf8'))

const nextWeek = {
	updatedAt: new Date().toISOString().slice(0, 10),
	members: currentWeek.members.map((member) => ({
		...member,
		level: member.level,
		combatPower: member.combatPower,
		expedition: { ...member.expedition },
		rivalry: member.rivalry,
		training: member.training,
		...(member.guildBoss !== undefined ? { guildBoss: member.guildBoss } : {})
	}))
}

writeFileSync(currentWeekPath, `${JSON.stringify(nextWeek, null, '\t')}\n`, 'utf8')

console.log('✅ current-week.json → previous-week.json 복사 완료')
console.log('✅ current-week.json 템플릿 생성 완료')
console.log('📝 updatedAt, members 데이터를 최신 값으로 수정하세요.')
